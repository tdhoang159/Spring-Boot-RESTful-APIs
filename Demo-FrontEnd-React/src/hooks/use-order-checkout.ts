import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createOrderAPI } from "../services/order.api";

export interface CheckoutStorageState {
  eventId: number;
  eventTitle: string;
  eventBannerUrl?: string;
  ticketTypeId: number;
  ticketTypeName: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
}

export interface CheckoutFormValues {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
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

      setLoading(true);
      try {
        const order = await createOrderAPI({
          eventId: checkoutState.eventId,
          buyerName: values.buyerName,
          buyerEmail: values.buyerEmail,
          buyerPhone: values.buyerPhone,
          items: [
            {
              ticketTypeId: checkoutState.ticketTypeId,
              quantity: checkoutState.quantity,
            },
          ],
        });

        sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
        navigate(
          `/payment?orderId=${order.orderId}&orderCode=${order.orderCode}&amount=${order.totalAmount}`,
        );
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
