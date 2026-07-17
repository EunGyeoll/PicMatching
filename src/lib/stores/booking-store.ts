import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BookingLocationType = "catalog" | "custom" | "tbd";

type BookingState = {
  photographerId: string | null;
  photographerName: string | null;
  cancellationPolicy: string | null;

  serviceId: string | null;
  serviceTitle: string | null;
  serviceCoverImageUrl: string | null;
  basePrice: number | null;
  durationMinutes: number | null;
  bufferBeforeMinutes: number | null;
  bufferAfterMinutes: number | null;
  maxParticipants: number | null;
  travelFee: number | null;
  nightSurcharge: number | null;
  weekendSurcharge: number | null;

  date: string | null;
  startTime: string | null;

  locationType: BookingLocationType | null;
  locationId: string | null;
  locationLabel: string | null;
  locationAddress: string | null;

  participantCount: number;
  requests: string;

  setService: (params: {
    photographerId: string;
    photographerName: string;
    cancellationPolicy: string | null;
    serviceId: string;
    serviceTitle: string;
    serviceCoverImageUrl: string | null;
    basePrice: number;
    durationMinutes: number;
    bufferBeforeMinutes: number;
    bufferAfterMinutes: number;
    maxParticipants: number | null;
    travelFee: number | null;
    nightSurcharge: number | null;
    weekendSurcharge: number | null;
  }) => void;
  setSchedule: (date: string, startTime: string) => void;
  setLocation: (params: {
    locationType: BookingLocationType;
    locationId: string | null;
    locationLabel: string | null;
    locationAddress: string | null;
  }) => void;
  setParticipantCount: (count: number) => void;
  setRequests: (text: string) => void;
  reset: () => void;
};

const initialState = {
  photographerId: null,
  photographerName: null,
  cancellationPolicy: null,
  serviceId: null,
  serviceTitle: null,
  serviceCoverImageUrl: null,
  basePrice: null,
  durationMinutes: null,
  bufferBeforeMinutes: null,
  bufferAfterMinutes: null,
  maxParticipants: null,
  travelFee: null,
  nightSurcharge: null,
  weekendSurcharge: null,
  date: null,
  startTime: null,
  locationType: null,
  locationId: null,
  locationLabel: null,
  locationAddress: null,
  participantCount: 1,
  requests: "",
} satisfies Partial<BookingState>;

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,
      setService: (params) =>
        set({ ...params, date: null, startTime: null }),
      setSchedule: (date, startTime) => set({ date, startTime }),
      setLocation: (params) => set(params),
      setParticipantCount: (count) => set({ participantCount: count }),
      setRequests: (text) => set({ requests: text }),
      reset: () => set(initialState),
    }),
    { name: "booking-flow-storage" },
  ),
);
