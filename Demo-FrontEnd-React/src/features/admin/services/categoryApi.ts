import { adminApiClient, unwrapApiData } from "./adminApiClient";
import type { ApiResponse, CategoryPayload, CategoryRecord } from "../types/admin.types";

export const categoryApi = {
  async getCategories(): Promise<CategoryRecord[]> {
    const res = await adminApiClient.get<ApiResponse<CategoryRecord[]>>("/api/categories");
    return unwrapApiData(res.data);
  },
  async getCategory(id: number): Promise<CategoryRecord> {
    const res = await adminApiClient.get<ApiResponse<CategoryRecord>>(`/api/categories/${id}`);
    return unwrapApiData(res.data);
  },
  async createCategory(payload: CategoryPayload): Promise<CategoryRecord> {
    const res = await adminApiClient.post<ApiResponse<CategoryRecord>>("/api/categories", payload);
    return unwrapApiData(res.data);
  },
  async updateCategory(id: number, payload: CategoryPayload): Promise<CategoryRecord> {
    const res = await adminApiClient.put<ApiResponse<CategoryRecord>>(`/api/categories/${id}`, payload);
    return unwrapApiData(res.data);
  },
  async deleteCategory(id: number): Promise<void> {
    await adminApiClient.delete(`/api/categories/${id}`);
  },
};
