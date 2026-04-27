
import axiosInstance from "../lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  errorCode?: string | null;
  timeStamp?: string;
}

export interface CreateOrderItemPayload {
  ticketTypeId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  eventId: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  items: CreateOrderItemPayload[];
}

export interface OrderItem {
  orderItemId?: number;
  ticketTypeId: number;
  ticketTypeName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID";

export interface Order {
  orderId: number;
  orderCode: string;
  eventId?: number;
  eventTitle?: string;
  eventBannerUrl?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// ── API functions ─────────────────────────────────────────────────────────────

// POST /api/orders
export const createOrderAPI = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const res = await axiosInstance.post<ApiResponse<Order>>("/api/orders", payload);
  return res.data.data;
};

// GET /api/orders/my
export const getMyOrdersAPI = async (): Promise<Order[]> => {
  const res = await axiosInstance.get<ApiResponse<Order[]>>("/api/orders/my");
  return res.data.data;
};

// GET /api/orders/:orderCode
export const getOrderDetailAPI = async (
  orderCode: string
): Promise<Order> => {
  const res = await axiosInstance.get<ApiResponse<Order>>(`/api/orders/${orderCode}`);
  return res.data.data;
};
