import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Spin, Divider, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { OrderStatusBadge, PaymentStatusBadge } from "../components/order/OrderStatusBadge";
import { getOrderDetailAPI } from "../services/order.api";
import type { Order } from "../services/order.api";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

const OrderDetailPage: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderCode) return;
    getOrderDetailAPI(orderCode)
      .then(setOrder)
      .catch(() => navigate("/orders"))
      .finally(() => setLoading(false));
  }, [orderCode]);

  if (loading) {
    return <div style={styles.center}><Spin size="large" /></div>;
  }

  if (!order) return null;

  const canPay = order.orderStatus === "PENDING" && order.paymentStatus === "UNPAID";

  return (
    <div style={styles.wrap}>
      <button style={styles.back} onClick={() => navigate("/orders")}>
        <ArrowLeftOutlined /> Đơn hàng của tôi
      </button>

      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div>
            <div style={styles.orderCode}>#{order.orderCode}</div>
            <div style={styles.createdAt}>{formatDate(order.createdAt)}</div>
          </div>
          <div style={styles.badges}>
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* Event info */}
        <div style={styles.eventRow}>
          {order.eventBannerUrl && (
            <img src={order.eventBannerUrl} alt="" style={styles.eventThumb} />
          )}
          <div style={styles.eventTitle}>{order.eventTitle}</div>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* Buyer info */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Thông tin người mua</div>
          <div style={styles.infoGrid}>
            <InfoRow label="Họ tên" value={order.buyerName} />
            <InfoRow label="Email" value={order.buyerEmail} />
            <InfoRow label="Số điện thoại" value={order.buyerPhone} />
          </div>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* Items */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Chi tiết vé</div>
          {order.items.map((item, i) => (
            <div key={i} style={styles.itemRow}>
              <span style={styles.itemName}>{item.ticketTypeName}</span>
              <span style={styles.itemQty}>x{item.quantity}</span>
              <span style={styles.itemPrice}>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <Divider style={{ margin: "16px 0" }} />

        {/* Total */}
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Tổng cộng</span>
          <span style={styles.totalValue}>{formatPrice(order.totalAmount)}</span>
        </div>

        {/* Actions */}
        {canPay && (
          <Button
            type="primary"
            block
            size="large"
            style={styles.payBtn}
            onClick={() => navigate(`/payment?orderId=${order.orderId}&orderCode=${order.orderCode}&amount=${order.totalAmount}`)}
          >
            Thanh toán ngay
          </Button>
        )}
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
    <span style={{ color: "#828BA0" }}>{label}</span>
    <span style={{ fontWeight: 600, color: "#1a1a2e" }}>{value}</span>
  </div>
);

export default OrderDetailPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 640, margin: "0 auto", padding: "24px 24px 48px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 },
  back: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#828BA0", fontSize: 14, marginBottom: 20, padding: 0 },
  card: { backgroundColor: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", padding: "24px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  orderCode: { fontWeight: 800, fontSize: 16, color: "#1a1a2e" },
  createdAt: { fontSize: 13, color: "#828BA0", marginTop: 4 },
  badges: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" },
  eventRow: { display: "flex", gap: 12, alignItems: "center" },
  eventThumb: { width: 64, height: 64, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  eventTitle: { fontWeight: 700, fontSize: 15, color: "#1a1a2e" },
  section: { marginBottom: 4 },
  sectionTitle: { fontWeight: 700, fontSize: 14, color: "#1a1a2e", marginBottom: 12 },
  infoGrid: {},
  itemRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 14 },
  itemName: { flex: 1, color: "#444" },
  itemQty: { color: "#828BA0" },
  itemPrice: { fontWeight: 600, color: "#1a1a2e" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  totalLabel: { fontWeight: 700, fontSize: 15, color: "#1a1a2e" },
  totalValue: { fontWeight: 800, fontSize: 20, color: "#2DC275" },
  payBtn: { backgroundColor: "#2DC275", borderColor: "#2DC275", borderRadius: 10, fontWeight: 700, height: 50 },
};
