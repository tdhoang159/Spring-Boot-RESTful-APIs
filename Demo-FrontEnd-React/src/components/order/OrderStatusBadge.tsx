import { Tag } from "antd";
import type { OrderStatus, PaymentStatus } from "./OrderCard";

// ── Configs ───────────────────────────────────────────────────────────────────
const ORDER_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:   { label: "Chờ xử lý",   color: "orange"  },
  CONFIRMED: { label: "Đã xác nhận", color: "green"   },
  EXPIRED:   { label: "Hết hạn",     color: "default" },
  CANCELLED: { label: "Đã huỷ",      color: "red"     },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  UNPAID: { label: "Chưa thanh toán", color: "volcano" },
  PAID:   { label: "Đã thanh toán",   color: "green"   },
};

// ── Components ────────────────────────────────────────────────────────────────
interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const cfg = ORDER_CONFIG[status];
  return <Tag color={cfg.color} style={styles.tag}>{cfg.label}</Tag>;
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const cfg = PAYMENT_CONFIG[status];
  return <Tag color={cfg.color} style={styles.tag}>{cfg.label}</Tag>;
};

const styles: Record<string, React.CSSProperties> = {
  tag: {
    fontWeight: 600,
    fontSize: 12,
    borderRadius: 6,
    padding: "2px 10px",
  },
};
