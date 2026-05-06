import axiosInstance from "../../attendee/lib/axios";
import type { ApiResponse } from "../types/admin.types";

export const unwrapApiData = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
};

export const adminApiClient = axiosInstance;
