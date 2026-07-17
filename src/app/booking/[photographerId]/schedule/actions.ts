"use server";

import { getAvailableSlots } from "@/lib/data/availability";

export async function fetchAvailableSlotsAction(params: {
  photographerId: string;
  date: string;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
}) {
  return getAvailableSlots(params);
}
