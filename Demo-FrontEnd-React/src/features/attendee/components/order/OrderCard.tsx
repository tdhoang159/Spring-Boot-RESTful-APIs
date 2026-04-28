import { Tag, Button } from "antd";
import { CalendarOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

// ── Types ─────────────────────────────────────────────────────────────────────
export type OrderStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID";

export interface OrderCardProps {
  orderCode: string;
  eventTitle: string;
  eventBannerUrl?: string;
  createdAt: string;       // ISO string
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  itemCount: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:   { label: "Chờ xử lý",  color: "orange" },
  CONFIRMED: { label: "Đã xác nhận", color: "green"  },
  EXPIRED:   { label: "Hết hạn",    color: "default" },
  CANCELLED: { label: "Đã huỷ",     color: "red"     },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  UNPAID: { label: "Chưa thanh toán", color: "volcano" },
  PAID:   { label: "Đã thanh toán",   color: "green"   },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN") + "đ";

// ── Component ─────────────────────────────────────────────────────────────────
const OrderCard: React.FC<OrderCardProps> = ({
  orderCode,
  eventTitle,
  eventBannerUrl,
  createdAt,
  totalAmount,
  orderStatus,
  paymentStatus,
  itemCount,
}) => {
  const navigate = useNavigate();
  const orderCfg  = ORDER_STATUS_CONFIG[orderStatus];
  const paymentCfg = PAYMENT_STATUS_CONFIG[paymentStatus];
  const canPay = orderStatus === "PENDING" && paymentStatus === "UNPAID";

  return (
    <div style={styles.wrap}>
      {/* Banner thumbnail */}
      {eventBannerUrl && (
        <div style={styles.imageWrap}>
          <img src={eventBannerUrl} alt={eventTitle} style={styles.image} />
        </div>
      )}

      {/* Content */}
      <div style={styles.body}>
        <div style={styles.top}>
          <div style={styles.eventTitle}>{eventTitle}</div>
          <div style={styles.tags}>
            <Tag color={orderCfg.color}>{orderCfg.label}</Tag>
            <Tag color={paymentCfg.color}>{paymentCfg.label}</Tag>
          </div>
        </div>

        <div style={styles.meta}>
          <span style={styles.metaItem}>
            <ShoppingOutlined style={styles.metaIcon} />
            Mã đơn: <strong>{orderCode}</strong>
          </span>
          <span style={styles.metaItem}>
            <CalendarOutlined style={styles.metaIcon} />
            {formatDate(createdAt)}
          </span>
          <span style={styles.metaItem}>
            {itemCount} vé
          </span>
        </div>

        <div style={styles.footer}>
          <div style={styles.total}>
            {formatPrice(totalAmount)}
          </div>
          <div style={styles.actions}>
            {canPay && (
              <Button
                type="primary"
                size="small"
                style={styles.payBtn}
                onClick={() => navigate(`/attendee/orders/${orderCode}`)}
              >
                Thanh toán
              </Button>
            )}
            <Button
              size="small"
              style={styles.detailBtn}
              onClick={() => navigate(`/attendee/orders/${orderCode}`)}
            >
              Chi tiết
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    gap: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    transition: "box-shadow 0.18s ease",
  },
  imageWrap: {
    width: 120,
    flexShrink: 0,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  body: {
    flex: 1,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minWidth: 0,
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  eventTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a2e",
    lineHeight: 1.4,
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tags: {
    display: "flex",
    gap: 4,
    flexShrink: 0,
  },
  meta: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    fontSize: 13,
    color: "#828BA0",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  metaIcon: {
    fontSize: 13,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f5f5f5",
    paddingTop: 10,
    marginTop: 2,
  },
  total: {
    fontWeight: 800,
    fontSize: 16,
    color: "#2DC275",
  },
  actions: {
    display: "flex",
    gap: 8,
  },
  payBtn: {
    backgroundColor: "#2DC275",
    borderColor: "#2DC275",
    borderRadius: 6,
    fontWeight: 600,
  },
  detailBtn: {
    borderRadius: 6,
  },
};
