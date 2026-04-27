import { useEffect } from "react";
import { useNavigate } from "react-router";
import { message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CheckoutForm from "../components/order/CheckoutForm";
import type { CheckoutFormValues } from "../components/order/CheckoutForm";
import { useOrderCheckout } from "../hooks/use-order-checkout";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkoutState, loading, initializing, missingCheckoutState, submitOrder } = useOrderCheckout();

  useEffect(() => {
    if (missingCheckoutState) {
      message.error("Không tìm thấy thông tin đặt vé");
      navigate("/");
    }
  }, [missingCheckoutState, navigate]);

  const handleSubmit = async (values: CheckoutFormValues) => {
    try {
      await submitOrder(values);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Đặt vé thất bại, vui lòng thử lại");
    }
  };

  if (initializing || !checkoutState) {
    return (
      <div style={styles.center}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      {/* Back button */}
      <button style={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeftOutlined /> Quay lại
      </button>

      <div style={styles.header}>
        <h2 style={styles.title}>Đặt vé</h2>
        <div style={styles.eventName}>{checkoutState.eventTitle}</div>
      </div>

      <div style={styles.content}>
        {/* Event thumbnail */}
        {checkoutState.eventBannerUrl && (
          <img
            src={checkoutState.eventBannerUrl}
            alt={checkoutState.eventTitle}
            style={styles.thumbnail}
          />
        )}

        {/* Checkout form */}
        <CheckoutForm
          onSubmit={handleSubmit}
          loading={loading}
          totalAmount={checkoutState.totalAmount}
          ticketTypeName={checkoutState.ticketTypeName}
          quantity={checkoutState.quantity}
          unitPrice={checkoutState.unitPrice}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 560, margin: "0 auto", padding: "24px 24px 48px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 },
  back: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#828BA0", fontSize: 14, marginBottom: 20, padding: 0 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 },
  eventName: { fontSize: 14, color: "#828BA0" },
  content: { display: "flex", flexDirection: "column", gap: 16 },
  thumbnail: { width: "100%", borderRadius: 12, objectFit: "cover", maxHeight: 200 },
};
