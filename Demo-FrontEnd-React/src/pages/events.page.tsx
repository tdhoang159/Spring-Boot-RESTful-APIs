import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Typography } from "antd";
import EventGrid from "../components/event/EventGrid";
import EventFilter from "../components/event/EventFilter";
import type { FilterValues } from "../components/event/EventFilter";
import CategoryTabs from "../components/common/CategoryTabs";
import { getApprovedEventsAPI } from "../services/event.api";
import type { EventItem, EventListParams } from "../services/event.api";

const { Title } = Typography;

const EventsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({
    keyword:      searchParams.get("keyword")      ?? "",
    city:         searchParams.get("city")         ?? "",
    categoryId:   searchParams.get("categoryId")   ?? "",
    date:         searchParams.get("date")         ?? "",
    locationType: (searchParams.get("locationType") as FilterValues["locationType"]) ?? "",
  });

  const fetchEvents = async (f: FilterValues, p = 1) => {
    setLoading(true);
    try {
      const params: EventListParams = {
        keyword: f.keyword,
        city: f.city,
        categoryId: f.categoryId,
        date: f.date,
        page: p - 1,
        size: 12,
      };
      if (f.locationType && (f.locationType === "ONLINE" || f.locationType === "OFFLINE")) {
        params.locationType = f.locationType;
      }
      const res = await getApprovedEventsAPI(params);
      setEvents(res.content);
      setTotal(res.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(filters, 1); }, []);

  const handleFilter = (values: FilterValues) => {
    setFilters(values);
    setPage(1);
    fetchEvents(values, 1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchEvents(filters, p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={styles.wrap}>
      <Title level={3} style={styles.title}>Khám phá sự kiện</Title>

      <CategoryTabs />

      <EventFilter
        initialValues={filters}
        onFilter={handleFilter}
        loading={loading}
      />

      <div style={styles.results}>
        {!loading && (
          <div style={styles.count}>
            Tìm thấy <strong>{total}</strong> sự kiện
          </div>
        )}
        <EventGrid
          events={events.map((e) => ({ ...e }))}
          loading={loading}
          total={total}
          page={page}
          pageSize={12}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default EventsPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 24px 48px",
  },
  title: {
    fontWeight: 800,
    color: "#1a1a2e",
    marginBottom: 8,
  },
  results: {
    marginTop: 4,
  },
  count: {
    fontSize: 14,
    color: "#828BA0",
    marginBottom: 16,
  },
};
