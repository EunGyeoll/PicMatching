"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import { kstDateTimeToISO, addMinutesToTime, dayOfWeek } from "@/lib/date-time";
import type { BookingLocationType } from "@/lib/stores/booking-store";

export type CreateBookingInput = {
  photographerId: string;
  serviceId: string;
  date: string;
  startTime: string;
  locationType: BookingLocationType;
  locationId: string | null;
  locationLabel: string | null;
  locationAddress: string | null;
  participantCount: number;
  requests: string;
};

export type CreateBookingResult = { error: string } | { bookingId: string };

export async function createBookingAction(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const user = await getAuthUser();
  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const supabase = await createClient();

  // 서버에서 서비스 정보를 다시 조회합니다 — 클라이언트가 들고 온 가격/시간을 신뢰하지 않습니다.
  const { data: service, error: serviceError } = await supabase
    .from("shooting_services")
    .select(
      "id, title, price, duration_minutes, buffer_before_minutes, buffer_after_minutes, max_participants, travel_fee, night_surcharge, weekend_surcharge",
    )
    .eq("id", input.serviceId)
    .eq("photographer_id", input.photographerId)
    .eq("is_published", true)
    .maybeSingle();

  if (serviceError || !service) {
    return { error: "선택한 촬영 서비스를 찾을 수 없습니다. 처음부터 다시 시도해주세요." };
  }

  if (
    input.participantCount < 1 ||
    (service.max_participants !== null && input.participantCount > service.max_participants)
  ) {
    return { error: "촬영 인원을 다시 확인해주세요." };
  }

  const startsAtIso = kstDateTimeToISO(input.date, input.startTime);
  const endsAtIso = kstDateTimeToISO(
    input.date,
    addMinutesToTime(input.startTime, service.duration_minutes),
  );

  if (new Date(startsAtIso).getTime() <= Date.now()) {
    return { error: "이미 지난 시간은 예약할 수 없습니다. 일정을 다시 선택해주세요." };
  }

  let additionalFee = 0;
  if (service.weekend_surcharge && [0, 6].includes(dayOfWeek(input.date))) {
    additionalFee += service.weekend_surcharge;
  }
  if (service.night_surcharge && Number(input.startTime.slice(0, 2)) >= 18) {
    additionalFee += service.night_surcharge;
  }
  if (service.travel_fee && input.locationType === "custom") {
    additionalFee += service.travel_fee;
  }

  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      customer_id: user.id,
      photographer_id: input.photographerId,
      service_id: service.id,
      starts_at: startsAtIso,
      ends_at: endsAtIso,
      duration_minutes: service.duration_minutes,
      buffer_before_minutes: service.buffer_before_minutes,
      buffer_after_minutes: service.buffer_after_minutes,
      location_type: input.locationType,
      location_id: input.locationId,
      location_label: input.locationLabel,
      location_address: input.locationAddress,
      participant_count: input.participantCount,
      requests: input.requests || null,
      service_title_snapshot: service.title,
      base_price_snapshot: service.price,
      additional_fee_snapshot: additionalFee,
      total_price_snapshot: service.price + additionalFee,
      status: "requested",
    })
    .select("id")
    .single();

  if (insertError) {
    if (insertError.code === "23P01") {
      return { error: "이미 다른 예약이 있는 시간이에요. 다른 시간을 선택해주세요." };
    }
    return { error: "예약 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  return { bookingId: booking.id };
}
