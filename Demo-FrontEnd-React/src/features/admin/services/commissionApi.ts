import { adminApiClient, unwrapApiData } from "./adminApiClient";
import type { ApiResponse, CommissionConfig, CommissionPayload } from "../types/admin.types";

const COMMISSION_PATH = "/api/admin/commission-configs";

export const commissionApi = {
  async getCommissionConfigs(): Promise<CommissionConfig[]> {
    // TODO: create this endpoint in Spring Boot or adjust COMMISSION_PATH to the final backend route.
    const res = await adminApiClient.get<ApiResponse<CommissionConfig[]> | CommissionConfig[]>(COMMISSION_PATH);
    return unwrapApiData(res.data);
  },
  async createCommissionConfig(payload: CommissionPayload): Promise<CommissionConfig> {
    const res = await adminApiClient.post<ApiResponse<CommissionConfig> | CommissionConfig>(COMMISSION_PATH, payload);
    return unwrapApiData(res.data);
  },
  async updateCommissionConfig(id: number, payload: CommissionPayload): Promise<CommissionConfig> {
    const res = await adminApiClient.put<ApiResponse<CommissionConfig> | CommissionConfig>(`${COMMISSION_PATH}/${id}`, payload);
    return unwrapApiData(res.data);
  },
  async deleteCommissionConfig(id: number): Promise<void> {
    await adminApiClient.delete(`${COMMISSION_PATH}/${id}`);
  },
};
