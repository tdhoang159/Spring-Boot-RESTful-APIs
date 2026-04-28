import { Row, Col, Pagination, Empty, Spin } from "antd";
import EventCard from "./EventCard";
import type { EventCardProps } from "./EventCard";

// ── Types ─────────────────────────────────────────────────────────────────────
interface EventGridProps {
  events: EventCardProps[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const EventGrid: React.FC<EventGridProps> = ({
  events,
  loading = false,
  total = 0,
  page = 1,
  pageSize = 12,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div style={styles.center}>
        <Spin size="large" />
      </div>
    );
  }

  if (!loading && events.length === 0) {
    return (
      <div style={styles.center}>
        <Empty description="Không tìm thấy sự kiện nào" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[20, 24]}>
        {events.map((event) => (
          <Col key={event.slug} xs={24} sm={12} md={8} lg={6}>
            <EventCard {...event} />
          </Col>
        ))}
      </Row>

      {total > pageSize && (
        <div style={styles.pagination}>
          <Pagination
            current={page}
            total={total}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default EventGrid;

const styles: Record<string, React.CSSProperties> = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: 40,
  },
};
