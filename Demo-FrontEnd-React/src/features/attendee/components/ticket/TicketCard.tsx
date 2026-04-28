import { Tag } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";

// ── Types ─────────────────────────────────────────────────────────────────────
export type TicketStatus = "ACTIVE" | "USED" | "CANCELLED" | "EXPIRED";

export interface TicketCardProps {
  ticketCode: string;
  eventTitle: string;
  eventBannerUrl?: string;
  eventStartTime: string;
  eventLocation: string;
  ticketTypeName: string;
  attendeeName: string;
  status: TicketStatus;
}

// ── Config ────────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<TicketStatus, { label: string; color: string }> = {
  ACTIVE:    { label: "Hợp lệ",    color: "green"   },
  USED:      { label: "Đã dùng",   color: "default" },
  CANCELLED: { label: "Đã huỷ",    color: "red"     },
  EXPIRED:   { label: "Hết hạn",   color: "orange"  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    weekday: "short", day: "2-digit",
    month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

// ── Component ─────────────────────────────────────────────────────────────────
const TicketCard: React.FC<TicketCardProps> = ({
  ticketCode,
  eventTitle,
  eventBannerUrl,
  eventStartTime,
  eventLocation,
  ticketTypeName,
  attendeeName,
  status,
}) => {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[status];
  const isActive = status === "ACTIVE";

  return (
    <div
      style={{
        ...styles.wrap,
        opacity: isActive ? 1 : 0.7,
        cursor: isActive ? "pointer" : "default",
      }}
      onClick={() => isActive && navigate(`/attendee/tickets/${ticketCode}`)}
    >
      {/* Left - banner */}
      <div style={styles.imageWrap}>
        {eventBannerUrl ? (
          <img src={eventBannerUrl} alt={eventTitle} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>
            <QrcodeOutlined style={{ fontSize: 32, color: "#d9d9d9" }} />
          </div>
        )}
      </div>

      {/* Right - content */}
      <div style={styles.body}>
        <div style={styles.header}>
          <div style={styles.eventTitle}>{eventTitle}</div>
          <Tag color={cfg.color} style={styles.statusTag}>{cfg.label}</Tag>
        </div>

        <div style={styles.ticketType}>{ticketTypeName}</div>

        <div style={styles.meta}>
          <div style={styles.metaRow}>
            <CalendarOutlined style={styles.metaIcon} />
            <span>{formatDate(eventStartTime)}</span>
          </div>
          <div style={styles.metaRow}>
            <EnvironmentOutlined style={styles.metaIcon} />
            <span style={styles.metaText}>{eventLocation}</span>
          </div>
        </div>

        <div style={styles.footer}>
          <span style={styles.attendee}>{attendeeName}</span>
          <span style={styles.code}>#{ticketCode}</span>
        </div>
      </div>

      {/* QR hint for active tickets */}
      {isActive && (
        <div style={styles.qrHint}>
          <QrcodeOutlined style={{ fontSize: 28, color: "#2DC275" }} />
          <span style={styles.qrLabel}>Xem QR</span>
        </div>
      )}
    </div>
  );
};

export default TicketCard;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "1px solid #f0f0f0",
    overflow: "hidden",
    transition: "box-shadow 0.18s ease",
    position: "relative",
  },
  imageWrap: {
    width: 100,
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fafafa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  eventTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: "#1a1a2e",
    lineHeight: 1.4,
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  statusTag: {
    fontWeight: 600,
    fontSize: 11,
    flexShrink: 0,
    margin: 0,
  },
  ticketType: {
    fontSize: 12,
    color: "#2DC275",
    fontWeight: 600,
    backgroundColor: "#f0fdf7",
    borderRadius: 4,
    padding: "2px 8px",
    display: "inline-block",
    alignSelf: "flex-start",
  },
  meta: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 12,
    color: "#828BA0",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  metaIcon: {
    fontSize: 12,
    flexShrink: 0,
  },
  metaText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px dashed #f0f0f0",
    paddingTop: 6,
    marginTop: 2,
    fontSize: 12,
  },
  attendee: {
    color: "#555",
    fontWeight: 500,
  },
  code: {
    color: "#bbb",
    fontFamily: "monospace",
    fontSize: 11,
  },
  qrHint: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: "0 14px",
    borderLeft: "1px dashed #e8e8e8",
    flexShrink: 0,
  },
  qrLabel: {
    fontSize: 11,
    color: "#2DC275",
    fontWeight: 600,
  },
};
