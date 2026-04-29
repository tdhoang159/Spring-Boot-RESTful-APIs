import { Button, Spin } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

// ── Types ─────────────────────────────────────────────────────────────────────
export type PaymentState = "WAITING" | "PAID" | "EXPIRED" | "FAILED";

interface PaymentStatusCardProps {
  state: PaymentState;
  orderCode: string;
  totalAmount: number;
  onRetry?: () => void;
}

// ── Config ────────────────────────────────────────────────────────────────────
const STATE_CONFIG: Record<
  PaymentState,
  { icon: React.ReactNode; color: string; title: string; desc: string }
> = {
  WAITING: {
    icon: <ClockCircleFilled style={{ fontSize: 48, color: "#2DC275" }} />,
    color: "#2DC275",
    title: "Đang chờ thanh toán",
    desc: "Quét mã QR bên trên để hoàn tất thanh toán",
  },
  PAID: {
    icon: <CheckCircleFilled style={{ fontSize: 48, color: "#2DC275" }} />,
    color: "#2DC275",
    title: "Thanh toán thành công!",
    desc: "Đơn hàng của bạn đã được xác nhận",
  },
  EXPIRED: {
    icon: <CloseCircleFilled style={{ fontSize: 48, color: "#d9d9d9" }} />,
    color: "#d9d9d9",
    title: "Đã hết thời gian",
    desc: "Phiên thanh toán đã hết hạn. Vui lòng thử lại.",
  },
  FAILED: {
    icon: <CloseCircleFilled style={{ fontSize: 48, color: "#ff4d4f" }} />,
    color: "#ff4d4f",
    title: "Thanh toán thất bại",
    desc: "Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ.",
  },
};

const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

// ── Component ─────────────────────────────────────────────────────────────────
const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  state,
  orderCode,
  totalAmount,
  onRetry,
}) => {
  const navigate = useNavigate();
  const cfg = STATE_CONFIG[state];

  return (
    <div style={styles.wrap}>
      {/* Status icon */}
      <div style={styles.iconWrap}>
        {state === "WAITING" ? (
          <Spin
            indicator={
              <ClockCircleFilled style={{ fontSize: 48, color: "#2DC275" }} />
            }
          />
        ) : (
          cfg.icon
        )}
      </div>

      {/* Text */}
      <div style={{ ...styles.title, color: cfg.color }}>{cfg.title}</div>
      <div style={styles.desc}>{cfg.desc}</div>

      {/* Order info */}
      <div style={styles.infoBox}>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Mã đơn hàng</span>
          <span style={styles.infoValue}>{orderCode}</span>
        </div>
        <div style={styles.infoRow}>
          <span style={styles.infoLabel}>Số tiền</span>
          <span style={{ ...styles.infoValue, color: "#2DC275", fontWeight: 800 }}>
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {state === "PAID" && (
          <Button
            type="primary"
            size="large"
            style={styles.primaryBtn}
            onClick={() => navigate("/tickets")}
          >
            Xem vé của tôi
          </Button>
        )}
        {(state === "EXPIRED" || state === "FAILED") && (
          <Button
            icon={<ReloadOutlined />}
            size="large"
            style={styles.retryBtn}
            onClick={onRetry}
          >
            Thử lại
          </Button>
        )}
        {state !== "PAID" && (
          <Button
            size="large"
            style={styles.secondaryBtn}
            onClick={() => navigate("/orders")}
          >
            Đơn hàng của tôi
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusCard;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "24px 20px",
    backgroundColor: "#fff",
    borderRadius: 16,
    border: "1px solid #f0f0f0",
  },
  iconWrap: {
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    textAlign: "center",
  },
  desc: {
    fontSize: 14,
    color: "#828BA0",
    textAlign: "center",
    lineHeight: 1.5,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#f8fffe",
    border: "1px solid #e6f7f0",
    borderRadius: 10,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 4,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
  },
  infoLabel: {
    color: "#828BA0",
  },
  infoValue: {
    fontWeight: 600,
    color: "#1a1a2e",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: "#2DC275",
    borderColor: "#2DC275",
    borderRadius: 10,
    fontWeight: 700,
    height: 48,
  },
  retryBtn: {
    borderRadius: 10,
    fontWeight: 700,
    height: 48,
    borderColor: "#2DC275",
    color: "#2DC275",
  },
  secondaryBtn: {
    borderRadius: 10,
    height: 44,
    color: "#828BA0",
  },
};
