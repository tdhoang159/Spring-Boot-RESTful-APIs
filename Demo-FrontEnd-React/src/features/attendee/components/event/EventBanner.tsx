import { Carousel } from "antd";
import { useNavigate } from "react-router";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface BannerEvent {
  slug: string;
  title: string;
  bannerUrl: string;
  description?: string;
}

interface EventBannerProps {
  events: BannerEvent[];
  autoplay?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
const EventBanner: React.FC<EventBannerProps> = ({
  events,
  autoplay = true,
}) => {
  const navigate = useNavigate();

  if (events.length === 0) return null;

  return (
    <div style={styles.wrap}>
      <Carousel autoplay={autoplay} dots effect="fade">
        {events.map((event) => (
          <div key={event.slug}>
            <div
              style={styles.slide}
              onClick={() => navigate(`/attendee/events/${event.slug}`)}
            >
              {/* Background image */}
              <div
                style={{
                  ...styles.bg,
                  backgroundImage: `url(${event.bannerUrl})`,
                }}
              />
              {/* Gradient overlay */}
              <div style={styles.overlay} />

              {/* Text content */}
              <div style={styles.content}>
                <h2 style={styles.title}>{event.title}</h2>
                {event.description && (
                  <p style={styles.desc}>{event.description}</p>
                )}
                <button style={styles.cta}>Xem chi tiết</button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default EventBanner;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
  },
  slide: {
    position: "relative",
    height: 420,
    cursor: "pointer",
    overflow: "hidden",
  },
  bg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "transform 0.4s ease",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
  },
  content: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    zIndex: 2,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 8,
    lineHeight: 1.3,
    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  desc: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    marginBottom: 20,
    maxWidth: 600,
    lineHeight: 1.5,
  },
  cta: {
    backgroundColor: "#2DC275",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
};
