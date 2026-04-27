import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Spin, Tag, Divider } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import TicketTypeCard from "../components/ticket/TicketTypeCard";
import { getEventDetailAPI } from "../services/event.api";
import type { EventDetail } from "../services/event.api";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    weekday: "long", day: "2-digit",
    month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getEventDetailAPI(slug)
      .then(setEvent)
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSelectTicket = (ticketTypeId: number, quantity: number) => {
    if (!event) return;
    const ticketType = event.ticketTypes.find((t) => t.id === ticketTypeId);
    if (!ticketType) return;

    // Lưu vào sessionStorage để checkout đọc
    sessionStorage.setItem(
      "checkout",
      JSON.stringify({
        eventId: event.id,
        eventTitle: event.title,
        eventBannerUrl: event.bannerUrl,
        ticketTypeId,
        ticketTypeName: ticketType.name,
        unitPrice: ticketType.price,
        quantity,
        totalAmount: ticketType.price * quantity,
      })
    );
    navigate(`/events/${slug}/checkout`);
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <Spin size="large" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div style={styles.wrap}>
      {/* Banner */}
      <div style={styles.bannerWrap}>
        <img src={event.bannerUrl} alt={event.title} style={styles.banner} />
        <div style={styles.bannerOverlay} />
      </div>

      <div style={styles.content}>
        {/* Left - event info */}
        <div style={styles.left}>
          <div style={styles.tags}>
            {event.category && <Tag color="green">{event.category}</Tag>}
            <Tag color={event.locationType === "ONLINE" ? "blue" : "orange"}>
              {event.locationType === "ONLINE" ? "Online" : "Trực tiếp"}
            </Tag>
          </div>

          <h1 style={styles.title}>{event.title}</h1>

          <div style={styles.metaList}>
            <div style={styles.metaItem}>
              <CalendarOutlined style={styles.metaIcon} />
              <div>
                <div style={styles.metaLabel}>Thời gian</div>
                <div style={styles.metaValue}>{formatDate(event.startTime)}</div>
                {event.endTime && (
                  <div style={styles.metaValue}>→ {formatDate(event.endTime)}</div>
                )}
              </div>
            </div>
            <div style={styles.metaItem}>
              <EnvironmentOutlined style={styles.metaIcon} />
              <div>
                <div style={styles.metaLabel}>Địa điểm</div>
                <div style={styles.metaValue}>{event.location}</div>
                <div style={styles.metaCity}>{event.city}</div>
              </div>
            </div>
            <div style={styles.metaItem}>
              <UserOutlined style={styles.metaIcon} />
              <div>
                <div style={styles.metaLabel}>Ban tổ chức</div>
                <div style={styles.metaValue}>{event.organizerName}</div>
              </div>
            </div>
          </div>

          <Divider />

          {/* Description */}
          <div style={styles.descTitle}>Giới thiệu sự kiện</div>
          <div
            style={styles.desc}
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        </div>

        {/* Right - ticket types */}
        <div style={styles.right}>
          <div style={styles.ticketBox}>
            <div style={styles.ticketBoxTitle}>Chọn loại vé</div>
            <div style={styles.ticketList}>
              {event.ticketTypes.length === 0 ? (
                <div style={styles.noTicket}>Chưa có loại vé nào</div>
              ) : (
                event.ticketTypes.map((t) => (
                  <TicketTypeCard
                    key={t.id}
                    {...t}
                    onSelect={handleSelectTicket}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 },
  bannerWrap: { position: "relative", width: "100%", height: 360, overflow: "hidden", borderRadius: "0 0 20px 20px", marginBottom: 32 },
  banner: { width: "100%", height: "100%", objectFit: "cover" },
  bannerOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" },
  content: { display: "flex", gap: 32, alignItems: "flex-start" },
  left: { flex: 1, minWidth: 0 },
  right: { width: 340, flexShrink: 0, position: "sticky", top: 96 },
  tags: { display: "flex", gap: 8, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.3, marginBottom: 24 },
  metaList: { display: "flex", flexDirection: "column", gap: 16 },
  metaItem: { display: "flex", gap: 12, alignItems: "flex-start" },
  metaIcon: { fontSize: 18, color: "#2DC275", marginTop: 2 },
  metaLabel: { fontSize: 12, color: "#828BA0", fontWeight: 500 },
  metaValue: { fontSize: 14, color: "#1a1a2e", fontWeight: 600 },
  metaCity: { fontSize: 13, color: "#828BA0" },
  descTitle: { fontWeight: 700, fontSize: 16, marginBottom: 12, color: "#1a1a2e" },
  desc: { fontSize: 14, lineHeight: 1.8, color: "#444" },
  ticketBox: { backgroundColor: "#fff", borderRadius: 16, border: "1px solid #f0f0f0", padding: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" },
  ticketBoxTitle: { fontWeight: 800, fontSize: 16, color: "#1a1a2e", marginBottom: 16 },
  ticketList: { display: "flex", flexDirection: "column", gap: 12 },
  noTicket: { color: "#828BA0", textAlign: "center", padding: "20px 0", fontSize: 14 },
};
