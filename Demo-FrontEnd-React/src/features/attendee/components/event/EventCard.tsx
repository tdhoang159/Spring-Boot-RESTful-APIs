import { Tag } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface EventCardProps {
  slug: string;
  title: string;
  bannerUrl: string;
  startTime: string;    // ISO string
  location: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  locationType: "ONLINE" | "OFFLINE";
  category?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (price: number) =>
  price === 0
    ? "Miễn phí"
    : price.toLocaleString("vi-VN") + "đ";

// ── Component ─────────────────────────────────────────────────────────────────
const EventCard: React.FC<EventCardProps> = ({
  slug,
  title,
  bannerUrl,
  startTime,
  location,
  city,
  minPrice,
  maxPrice,
  locationType,
  category,
}) => {
  const navigate = useNavigate();

  const priceLabel =
    minPrice === maxPrice
      ? formatPrice(minPrice)
      : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;

  return (
    <div style={styles.wrap} onClick={() => navigate(`/attendee/events/${slug}`)}>
      {/* Banner */}
      <div style={styles.imageWrap}>
        <img src={bannerUrl} alt={title} style={styles.image} />
        {locationType === "ONLINE" && (
          <Tag color="blue" style={styles.onlineTag}>Online</Tag>
        )}
        {category && (
          <Tag color="green" style={styles.categoryTag}>{category}</Tag>
        )}
      </div>

      {/* Content */}
      <div style={styles.body}>
        <div style={styles.title}>{title}</div>

        <div style={styles.meta}>
          <CalendarOutlined style={styles.metaIcon} />
          <span>{formatDate(startTime)}</span>
        </div>

        <div style={styles.meta}>
          <EnvironmentOutlined style={styles.metaIcon} />
          <span style={styles.metaText}>{location} · {city}</span>
        </div>

        <div style={styles.price}>{priceLabel}</div>
      </div>
    </div>
  );
};

export default EventCard;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    border: "1px solid #f0f0f0",
    cursor: "pointer",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    display: "flex",
    flexDirection: "column",
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%", // 16:9
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  onlineTag: {
    position: "absolute",
    top: 10,
    left: 10,
    margin: 0,
    fontWeight: 600,
  },
  categoryTag: {
    position: "absolute",
    top: 10,
    right: 10,
    margin: 0,
    fontWeight: 600,
  },
  body: {
    padding: "12px 14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    flex: 1,
  },
  title: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a2e",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: 4,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#828BA0",
  },
  metaIcon: {
    fontSize: 13,
    flexShrink: 0,
  },
  metaText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  price: {
    marginTop: 8,
    fontWeight: 700,
    fontSize: 15,
    color: "#2DC275",
  },
};
