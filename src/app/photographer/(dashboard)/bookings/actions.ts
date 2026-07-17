"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/supabase/auth";
import type { BookingStatus } from "@/types/domain";

export type BookingActionResult = { error?: string };

async function updateBookingStatus(
  bookingId: string,
  allowedCurrentStatuses: BookingStatus[],
  nextStatus: BookingStatus,
): Promise<BookingActionResult> {
  const user = await getAuthUser();
  if (!user) return { error: "로그인이 필요합니다." };

  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, photographer_id")
    .eq("id", bookingId)
    .maybeSingle();

  if (!booking || booking.photographer_id !== user.id) {
    return { error: "예약을 찾을 수 없습니다." };
  }

  if (!allowedCurrentStatuses.includes(booking.status)) {
    return { error: "이미 상태가 변경된 예약이에요. 새로고침 후 다시 시도해주세요." };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: nextStatus })
    .eq("id", bookingId);

  if (error) {
    return { error: "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/photographer/bookings");
  return {};
}

export async function confirmBookingAction(bookingId: string) {
  return updateBookingStatus(bookingId, ["requested"], "confirmed");
}

export async function rejectBookingAction(bookingId: string) {
  return updateBookingStatus(bookingId, ["requested"], "rejected");
}

export async function completeBookingAction(bookingId: string) {
  return updateBookingStatus(bookingId, ["confirmed"], "completed");
}
