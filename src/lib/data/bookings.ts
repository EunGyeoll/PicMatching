import { createClient } from "@/lib/supabase/server";
import type { BookingDetail, BookingListItem, PhotographerBookingItem } from "@/types/domain";

export async function getBookingDetail(bookingId: string): Promise<BookingDetail | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("bookings")
    .select(
      `id, status, starts_at, ends_at, service_title_snapshot, location_label, location_address,
       participant_count, requests, base_price_snapshot, additional_fee_snapshot, total_price_snapshot,
       photographer_profiles(display_name, contact_info)`,
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    status: data.status,
    serviceTitle: data.service_title_snapshot,
    photographerName: data.photographer_profiles?.display_name ?? "",
    photographerGuidance: data.photographer_profiles?.contact_info ?? null,
    startsAt: data.starts_at,
    endsAt: data.ends_at,
    locationLabel: data.location_label,
    locationAddress: data.location_address,
    participantCount: data.participant_count,
    requests: data.requests,
    basePrice: data.base_price_snapshot,
    additionalFee: data.additional_fee_snapshot,
    totalPrice: data.total_price_snapshot,
  };
}

export async function getMyBookings(customerId: string): Promise<BookingListItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("bookings")
    .select(
      `id, status, starts_at, ends_at, service_title_snapshot, photographer_profiles(display_name)`,
    )
    .eq("customer_id", customerId)
    .order("starts_at", { ascending: true });

  return (data ?? []).map((b) => ({
    id: b.id,
    status: b.status,
    serviceTitle: b.service_title_snapshot,
    photographerName: b.photographer_profiles?.display_name ?? "",
    startsAt: b.starts_at,
    endsAt: b.ends_at,
  }));
}

export async function getPhotographerBookings(
  photographerId: string,
): Promise<PhotographerBookingItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("bookings")
    .select(
      `id, status, starts_at, ends_at, service_title_snapshot, participant_count,
       profiles_public!bookings_customer_id_fkey(nickname)`,
    )
    .eq("photographer_id", photographerId)
    .order("starts_at", { ascending: true });

  return (data ?? []).map((b) => ({
    id: b.id,
    status: b.status,
    serviceTitle: b.service_title_snapshot,
    customerNickname: b.profiles_public?.nickname ?? "알 수 없음",
    startsAt: b.starts_at,
    endsAt: b.ends_at,
    participantCount: b.participant_count,
  }));
}
