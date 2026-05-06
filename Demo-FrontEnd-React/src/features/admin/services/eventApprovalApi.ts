import { adminApiClient, unwrapApiData } from "./adminApiClient";
import type { ApiResponse, EventRecord } from "../types/admin.types";

export const eventApprovalApi = {
  async getEvents(): Promise<EventRecord[]> {
    const res = await adminApiClient.get<ApiResponse<EventRecord[]>>("/api/events");
    return unwrapApiData(res.data);
  },
  async getPendingEvents(): Promise<EventRecord[]> {
    const events = await this.getEvents();
    return events.filter((event) => event.approvalStatus === "PENDING");
  },
  async getEvent(id: number): Promise<EventRecord> {
    const res = await adminApiClient.get<ApiResponse<EventRecord>>(`/api/events/${id}`);
    return unwrapApiData(res.data);
  },
  async approveEvent(event: EventRecord): Promise<EventRecord> {
    const res = await adminApiClient.put<ApiResponse<EventRecord>>(`/api/events/${event.eventId}`, {
      ...event,
      organizerId: event.organizer?.organizerId ?? event.organizer?.userId,
      categoryId: event.category?.categoryId,
      approvalStatus: "APPROVED",
    });
    return unwrapApiData(res.data);
  },
  async rejectEvent(event: EventRecord, reason: string): Promise<EventRecord> {
    // TODO: replace with a dedicated /api/admin/events/{id}/reject endpoint when backend supports storing rejection reason.
    const res = await adminApiClient.put<ApiResponse<EventRecord>>(`/api/events/${event.eventId}`, {
      ...event,
      organizerId: event.organizer?.organizerId ?? event.organizer?.userId,
      categoryId: event.category?.categoryId,
      approvalStatus: "REJECTED",
      reviewNote: reason,
    });
    return unwrapApiData(res.data);
  },
};
