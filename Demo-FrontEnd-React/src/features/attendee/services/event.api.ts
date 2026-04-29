
import axiosInstance from "../lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface EventListParams {
  keyword?: string;
  city?: string;
  categoryId?: string;
  date?: string;
  locationType?: "ONLINE" | "OFFLINE";
  page?: number;
  size?: number;
}

export interface TicketType {
  id: number;
  name: string;
  description?: string;
  price: number;
  availableQuantity: number;
  maxPerOrder?: number;
  saleStart?: string;
  saleEnd?: string;
  status?: string;
  isSaleOpen?: boolean;
}

export interface EventItem {
  id: number;
  slug: string;
  title: string;
  bannerUrl: string;
  startTime: string;
  endTime: string;
  location: string;
  city: string;
  locationType: "ONLINE" | "OFFLINE";
  minPrice: number;
  maxPrice: number;
  category?: string;
  categoryId?: string;
  organizerName?: string;
  shortDescription?: string;
}

export interface EventDetail extends EventItem {
  description: string;
  organizerName: string;
  ticketTypes: TicketType[];
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errorCode?: string | null;
  timeStamp?: string;
}

export interface EventCategory {
  id: string;
  label: string;
}

interface RawCategory {
  categoryId: number;
  categoryName: string;
  status?: string;
}

interface RawTicketType {
  ticketTypeId: number;
  ticketName: string;
  description?: string;
  price: number;
  quantityAvailable: number;
  maxPerOrder?: number;
  saleStartTime?: string;
  saleEndTime?: string;
  status?: string;
  isSaleOpen?: boolean;
}

interface RawEventSummary {
  eventId: number;
  slug: string;
  title: string;
  shortDescription?: string;
  bannerUrl: string;
  city: string;
  venueName: string;
  startTime: string;
  endTime: string;
  locationType: "ONLINE" | "OFFLINE";
  categoryName?: string;
  organizerName?: string;
  minPrice: number;
}

interface RawEventDetail extends RawEventSummary {
  description: string;
  venueAddress?: string;
  meetingUrl?: string;
  registrationDeadline?: string;
  organizerWebsite?: string;
  organizerDescription?: string;
  organizerIsVerified?: boolean;
  ticketTypes: RawTicketType[];
}

const mapTicketType = (ticketType: RawTicketType): TicketType => ({
  id: ticketType.ticketTypeId,
  name: ticketType.ticketName,
  description: ticketType.description,
  price: ticketType.price,
  availableQuantity: ticketType.quantityAvailable,
  maxPerOrder: ticketType.maxPerOrder,
  saleStart: ticketType.saleStartTime,
  saleEnd: ticketType.saleEndTime,
  status: ticketType.status,
  isSaleOpen: ticketType.isSaleOpen,
});

const mapEventSummary = (event: RawEventSummary): EventItem => ({
  id: event.eventId,
  slug: event.slug,
  title: event.title,
  bannerUrl: event.bannerUrl,
  startTime: event.startTime,
  endTime: event.endTime,
  location: event.venueName,
  city: event.city,
  locationType: event.locationType,
  minPrice: Number(event.minPrice ?? 0),
  maxPrice: Number(event.minPrice ?? 0),
  category: event.categoryName,
  organizerName: event.organizerName,
  shortDescription: event.shortDescription,
});

const mapEventDetail = (event: RawEventDetail): EventDetail => ({
  ...mapEventSummary(event),
  description: event.description,
  organizerName: event.organizerName ?? "",
  ticketTypes: (event.ticketTypes ?? []).map(mapTicketType),
});

const mapCategory = (category: RawCategory): EventCategory => ({
  id: String(category.categoryId),
  label: category.categoryName,
});

// ── API functions ─────────────────────────────────────────────────────────────

// GET /api/v1/events
export const getApprovedEventsAPI = async (
  params?: EventListParams
): Promise<PagedResponse<EventItem>> => {
  const res = await axiosInstance.get<PagedResponse<RawEventSummary>>("/api/v1/events", { params });
  return {
    ...res.data,
    content: (res.data.content ?? []).map(mapEventSummary),
  };
};

// GET /api/v1/events/:slug
export const getEventDetailAPI = async (
  slug: string
): Promise<EventDetail> => {
  const res = await axiosInstance.get<RawEventDetail>(`/api/v1/events/${slug}`);
  return mapEventDetail(res.data);
};

// GET /api/categories
export const getEventCategoriesAPI = async (): Promise<EventCategory[]> => {
  const res = await axiosInstance.get<ApiResponse<RawCategory[]>>("/api/categories");
  return (res.data.data ?? [])
    .filter((category) => category.status === "ACTIVE")
    .map(mapCategory);
};
