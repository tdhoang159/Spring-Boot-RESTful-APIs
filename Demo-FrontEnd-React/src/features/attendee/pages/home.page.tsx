import { useEffect, useState } from "react";
import { Typography } from "antd";
import EventBanner from "../components/event/EventBanner";
import EventGrid from "../components/event/EventGrid";
import CategoryTabs from "../components/common/CategoryTabs";
import { getApprovedEventsAPI } from "../services/event.api";
import type { EventItem } from "../services/event.api";

const { Title } = Typography;

const HomePage: React.FC = () => {
  const [featured, setFeatured] = useState<EventItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchEvents = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getApprovedEventsAPI({ page: p - 1, size: 8 });
      setEvents(res.content);
      setTotal(res.totalElements);
      if (p === 1) setFeatured(res.content.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(1); }, []);

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchEvents(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.wrap}>
      {/* Hero banner */}
      {featured.length > 0 && (
        <EventBanner
          events={featured.map((e) => ({
            slug: e.slug,
            title: e.title,
            bannerUrl: e.bannerUrl,
          }))}
        />
      )}

      {/* Category tabs */}
      <CategoryTabs />

      {/* Event list */}
      <div style={styles.section}>
        <Title level={4} style={styles.sectionTitle}>
          Sự kiện nổi bật
        </Title>
        <EventGrid
          events={events.map((e) => ({ ...e }))}
          loading={loading}
          total={total}
          page={page}
          pageSize={8}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default HomePage;

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 24px 48px",
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: 16,
    color: "#1a1a2e",
  },
};
