
import axiosInstance from "../lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errorCode?: string | null;
  timeStamp?: string;
}

export type TicketStatus = "ACTIVE" | "USED" | "CANCELLED" | "EXPIRED";

export interface Ticket {
  ticketId: number;
  ticketCode: string;
  qrCode: string;
  attendeeName: string;
  attendeeEmail?: string;
  eventId: number;
  eventTitle: string;
  eventBannerUrl?: string;
  eventStartTime: string;
  eventLocation: string;
  ticketTypeName: string;
  status: TicketStatus;
  issuedAt: string;
}

interface RawTicket {
  ticketId: number;
  ticketCode: string;
  qrCode: string;
  attendeeName: string;
  attendeeEmail?: string;
  eventId: number;
  eventTitle: string;
  eventStartTime: string;
  venueName?: string;
  ticketTypeName: string;
  status: "VALID" | "USED" | "CANCELLED" | "EXPIRED";
  issuedAt: string;
}

const normalizeStatus = (status: RawTicket["status"]): TicketStatus => {
  if (status === "VALID") return "ACTIVE";
  return status;
};

const mapTicket = (ticket: RawTicket): Ticket => ({
  ticketId: ticket.ticketId,
  ticketCode: ticket.ticketCode,
  qrCode: ticket.qrCode,
  attendeeName: ticket.attendeeName,
  attendeeEmail: ticket.attendeeEmail,
  eventId: ticket.eventId,
  eventTitle: ticket.eventTitle,
  eventStartTime: ticket.eventStartTime,
  eventLocation: ticket.venueName ?? "",
  ticketTypeName: ticket.ticketTypeName,
  status: normalizeStatus(ticket.status),
  issuedAt: ticket.issuedAt,
});

// ── API functions ─────────────────────────────────────────────────────────────

// GET /api/tickets/my
export const getMyTicketsAPI = async (): Promise<Ticket[]> => {
  const res = await axiosInstance.get<ApiResponse<RawTicket[]>>("/api/tickets/my");
  return res.data.data.map(mapTicket);
};

// GET /api/tickets/:ticketCode
export const getTicketDetailAPI = async (
  ticketCode: string
): Promise<Ticket> => {
  const res = await axiosInstance.get<ApiResponse<RawTicket>>(`/api/tickets/${ticketCode}`);
  return mapTicket(res.data.data);
};
