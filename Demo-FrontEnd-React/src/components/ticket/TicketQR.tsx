import { Tag } from "antd";
import QRDisplay from "../payment/QRDisplay";
import type { TicketStatus } from "./TicketCard";

// ── Types ─────────────────────────────────────────────────────────────────────
interface TicketQRProps {
  ticketCode: string;
  qrBase64: string;
  attendeeName: string;
  eventTitle: string;
  eventStartTime: string;
  eventLocation: string;
  ticketTypeName: string;
  status: TicketStatus;
}

// ── Config ────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  ACTIVE:    { label: "Hợp lệ",  color: "green"   },
  USED:      { label: "Đã dùng", color: "default" },
  CANCELLED: { label: "Đã huỷ",  color: "red"     },
  EXPIRED:   { label: "Hết hạn", color: "orange"  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    weekday: "long", day: "2-digit",
    month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

// ── Component ─────────────────────────────────────────────────────────────────
const TicketQR: React.FC<TicketQRProps> = ({
  ticketCode,
  qrBase64,
  attendeeName,
  eventTitle,
  eventStartTime,
  eventLocation,
  ticketTypeName,
  status,
}) => {
  const cfg = STATUS_CONFIG[status];
  const isActive = status === "ACTIVE";

  return (
    <div style={styles.wrap}>
      {/* Event title */}
      <div style={styles.eventTitle}>{eventTitle}</div>

      {/* Status badge */}
      <Tag color={cfg.color} style={styles.statusTag}>{cfg.label}</Tag>

      {/* QR code */}
      <div style={{ filter: isActive ? "none" : "grayscale(1) opacity(0.4)" }}>
        <QRDisplay
          base64={qrBase64}
          size={200}
          label={isActive ? "Xuất trình mã này tại cổng vào" : "Vé không còn hiệu lực"}
          showDownload={isActive}
        />
      </div>

      {/* Divider dashes */}
      <div style={styles.divider} />

      {/* Ticket info */}
      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Người tham dự</span>
          <span style={styles.infoValue}>{attendeeName}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Loại vé</span>
          <span style={styles.infoValue}>{ticketTypeName}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Thời gian</span>
          <span style={styles.infoValue}>{formatDate(eventStartTime)}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Địa điểm</span>
          <span style={styles.infoValue}>{eventLocation}</span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Mã vé</span>
          <span style={{ ...styles.infoValue, fontFamily: "monospace", fontSize: 13 }}>
            {ticketCode}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketQR;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: "28px 24px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
    maxWidth: 360,
    margin: "0 auto",
  },
  eventTitle: {
    fontWeight: 800,
    fontSize: 17,
    color: "#1a1a2e",
    textAlign: "center",
    lineHeight: 1.4,
  },
  statusTag: {
    fontWeight: 700,
    fontSize: 12,
    borderRadius: 6,
    padding: "3px 12px",
  },
  divider: {
    width: "100%",
    borderTop: "2px dashed #f0f0f0",
    margin: "4px 0",
  },
  infoGrid: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    fontSize: 14,
  },
  infoLabel: {
    color: "#828BA0",
    flexShrink: 0,
    fontWeight: 500,
  },
  infoValue: {
    color: "#1a1a2e",
    fontWeight: 600,
    textAlign: "right",
  },
};
