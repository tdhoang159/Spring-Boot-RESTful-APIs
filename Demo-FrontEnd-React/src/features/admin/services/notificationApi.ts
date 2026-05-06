import { adminApiClient, unwrapApiData } from "./adminApiClient";
import type { ApiResponse, NotificationPayload, NotificationRecord } from "../types/admin.types";

const NOTIFICATION_PATH = "/api/admin/notifications";

export const notificationApi = {
  async getNotifications(): Promise<NotificationRecord[]> {
    // TODO: create this endpoint in Spring Boot or adjust NOTIFICATION_PATH to the final backend route.
    const res = await adminApiClient.get<ApiResponse<NotificationRecord[]> | NotificationRecord[]>(NOTIFICATION_PATH);
    return unwrapApiData(res.data);
  },
  async createNotification(payload: NotificationPayload): Promise<NotificationRecord> {
    const res = await adminApiClient.post<ApiResponse<NotificationRecord> | NotificationRecord>(NOTIFICATION_PATH, payload);
    return unwrapApiData(res.data);
  },
  async updateNotification(id: number, payload: NotificationPayload): Promise<NotificationRecord> {
    const res = await adminApiClient.put<ApiResponse<NotificationRecord> | NotificationRecord>(`${NOTIFICATION_PATH}/${id}`, payload);
    return unwrapApiData(res.data);
  },
  async deleteNotification(id: number): Promise<void> {
    await adminApiClient.delete(`${NOTIFICATION_PATH}/${id}`);
  },
};
