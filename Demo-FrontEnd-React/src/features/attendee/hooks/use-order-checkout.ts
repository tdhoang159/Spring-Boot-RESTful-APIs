import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createOrderAPI } from "../services/order.api";

export interface CheckoutStorageState {
  eventId?: number;
  id?: number;
  eventTitle: string;
  eventBannerUrl?: string;
  ticketTypeId?: number;
  ticketTypeName: string;
  unitPrice: number;
  quantity?: number;
  totalAmount: number;
}

export interface CheckoutFormValues {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
}

export const CHECKOUT_STORAGE_KEY = "checkout";

export const useOrderCheckout = () => {
  const navigate = useNavigate();
  const [checkoutState, setCheckoutState] = useState<CheckoutStorageState | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!raw) {
      setInitializing(false);
      setCheckoutState(null);
      return;
    }

    try {
      setCheckoutState(JSON.parse(raw) as CheckoutStorageState);
    } catch {
      sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
      setCheckoutState(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  const submitOrder = useCallback(
    async (values: CheckoutFormValues) => {
      if (!checkoutState) {
        throw new Error("Không tìm thấy thông tin checkout");
      }

      const eventId = Number(checkoutState.eventId ?? checkoutState.id);
      const ticketTypeId = Number(checkoutState.ticketTypeId);
      const quantity = Number(checkoutState.quantity);

      if (!Number.isInteger(eventId) || eventId <= 0) {
        throw new Error("Thiếu thông tin sự kiện. Vui lòng chọn lại loại vé từ trang sự kiện.");
      }

      if (!Number.isInteger(ticketTypeId) || ticketTypeId <= 0) {
        throw new Error("Thiếu thông tin loại vé. Vui lòng chọn lại loại vé từ trang sự kiện.");
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Số lượng vé không hợp lệ. Vui lòng chọn lại vé.");
      }

      setLoading(true);
      try {
        const buyerName = values.buyerName.trim();
        const buyerEmail = values.buyerEmail.trim();
        const buyerPhone = values.buyerPhone?.trim();

        const order = await createOrderAPI({
          eventId,
          buyerName,
          buyerEmail,
          buyerPhone: buyerPhone || undefined,
          items: [
            {
              ticketTypeId,
              quantity,
            },
          ],
        });

        sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
        navigate(`/payment?orderId=${order.orderId}&orderCode=${order.orderCode}&amount=${order.totalAmount}`);
        return order;
      } finally {
        setLoading(false);
      }
    },
    [checkoutState, navigate],
  );

  return {
    checkoutState,
    loading,
    initializing,
    missingCheckoutState: !initializing && !checkoutState,
    submitOrder,
  };
};

export default useOrderCheckout;
