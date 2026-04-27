import { useCallback, useEffect, useRef, useState } from "react";
import { createSepayQrAPI, getPaymentStatusAPI } from "../services/payment.api";

export type PaymentUiState = "WAITING" | "PAID" | "EXPIRED" | "FAILED";

interface UsePaymentPollingOptions {
  orderId?: number;
  pollIntervalMs?: number;
  timeoutMs?: number;
  autoStart?: boolean;
  onPaid?: () => void;
  onExpired?: () => void;
}

export const usePaymentPolling = ({
  orderId,
  pollIntervalMs = 3000,
  timeoutMs = 10 * 60 * 1000,
  autoStart = true,
  onPaid,
  onExpired,
}: UsePaymentPollingOptions) => {
  const [loading, setLoading] = useState(autoStart);
  const [status, setStatus] = useState<PaymentUiState>("WAITING");
  const [qrData, setQrData] = useState<Awaited<ReturnType<typeof createSepayQrAPI>> | null>(null);

  const pollRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (!orderId) return;

    stopPolling();

    pollRef.current = window.setInterval(async () => {
      try {
        const response = await getPaymentStatusAPI(orderId);
        const nextStatus = response.status?.toLowerCase?.();

        if (nextStatus === "paid") {
          stopPolling();
          setStatus("PAID");
          onPaid?.();
          return;
        }

        if (nextStatus === "cancelled") {
          stopPolling();
          setStatus("FAILED");
        }
      } catch {
        // ignore transient polling errors
      }
    }, pollIntervalMs);

    timeoutRef.current = window.setTimeout(() => {
      stopPolling();
      setStatus("EXPIRED");
      onExpired?.();
    }, timeoutMs);
  }, [onExpired, onPaid, orderId, pollIntervalMs, stopPolling, timeoutMs]);

  const initPayment = useCallback(async () => {
    if (!orderId) return null;

    setLoading(true);
    setStatus("WAITING");
    try {
      const response = await createSepayQrAPI(orderId);
      setQrData(response);
      return response;
    } catch (error) {
      setStatus("FAILED");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!autoStart || !orderId) return;

    initPayment()
      .then(() => {
        startPolling();
      })
      .catch(() => undefined);

    return () => stopPolling();
  }, [autoStart, initPayment, orderId, startPolling, stopPolling]);

  return {
    loading,
    status,
    qrData,
    initPayment,
    startPolling,
    stopPolling,
    retry: async () => {
      const response = await initPayment();
      startPolling();
      return response;
    },
  };
};

export default usePaymentPolling;
