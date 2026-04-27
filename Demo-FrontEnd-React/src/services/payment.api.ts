import axiosInstance from "../lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errorCode?: string | null;
  timeStamp?: string;
}

export interface QrResponse {
  qrUrl: string;
  orderId: number;
  orderCode: string;
  description: string;
}

export type PaymentState = "pending" | "paid" | "cancelled";

export interface PaymentStatusResponse {
  orderId: number;
  orderCode: string;
  status: PaymentState;
  paidAmount?: number;
}

// ── API functions ─────────────────────────────────────────────────────────────

// POST /api/sepay/qr
export const createSepayQrAPI = async (
  orderId: number
): Promise<QrResponse> => {
  const res = await axiosInstance.post<ApiResponse<QrResponse>>("/api/sepay/qr", { orderId });
  return res.data.data;
};

// GET /api/sepay/status/:orderId
export const getPaymentStatusAPI = async (
  orderId: number
): Promise<PaymentStatusResponse> => {
  const res = await axiosInstance.get<ApiResponse<PaymentStatusResponse>>(`/api/sepay/status/${orderId}`);
  return res.data.data;
};
