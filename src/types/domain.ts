export type ServiceCard = {
  id: string;
  title: string;
  price: number;
  durationMinutes: number;
  coverImageUrl: string | null;
  photographerId: string;
  photographerName: string;
  areas: string[];
};

export type PhotographerSummary = {
  id: string;
  displayName: string;
  areas: string[];
  styleTags: string[];
  startingPrice: number | null;
  coverImageUrl: string | null;
};

export type RecentlyActivePhotographer = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  hasRecentUpdate: boolean;
};

export type ServiceDetail = {
  id: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  coverImageUrl: string | null;
  inclusions: string | null;
  retouchedPhotoCount: number | null;
  providesRawFiles: boolean | null;
  deliveryDays: number | null;
  maxParticipants: number | null;
  extraFeeConditions: string | null;
  tags: string[];
};

export type PhotographerDetail = {
  id: string;
  displayName: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  areas: string[];
  cancellationPolicy: string | null;
  portfolioImages: { id: string; url: string }[];
  services: ServiceDetail[];
  reviewCount: number;
  completedBookingCount: number;
};

export type BookableService = ServiceDetail & {
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  travelFee: number | null;
  nightSurcharge: number | null;
  weekendSurcharge: number | null;
};

export type BookablePhotographer = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  cancellationPolicy: string | null;
  services: BookableService[];
};

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "rejected"
  | "completed"
  | "cancelled";

export type BookingListItem = {
  id: string;
  status: BookingStatus;
  serviceTitle: string;
  photographerName: string;
  startsAt: string;
  endsAt: string;
};

export type BookingDetail = BookingListItem & {
  photographerGuidance: string | null;
  locationLabel: string | null;
  locationAddress: string | null;
  participantCount: number;
  requests: string | null;
  basePrice: number;
  additionalFee: number;
  totalPrice: number;
};

export type PhotographerBookingItem = {
  id: string;
  status: BookingStatus;
  serviceTitle: string;
  customerNickname: string;
  startsAt: string;
  endsAt: string;
  participantCount: number;
};

export type LocationOption = {
  id: string;
  name: string;
  area: string;
  description: string | null;
  address: string | null;
  coverImageUrl: string | null;
  hasTravelFee: boolean;
  isPhotographerOwn: boolean;
};
