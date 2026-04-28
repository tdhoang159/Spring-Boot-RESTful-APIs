import { useEffect, useState } from "react";
import { Spin, Empty, Tabs } from "antd";
import TicketCard from "../components/ticket/TicketCard";
import { getMyTicketsAPI } from "../services/ticket.api";
import type { Ticket, TicketStatus } from "../services/ticket.api";

const { TabPane } = Tabs;

const STATUS_TABS: { key: string; label: string; statuses: TicketStatus[] }[] = [
  { key: "all",      label: "Tất cả",   statuses: ["ACTIVE", "USED", "CANCELLED", "EXPIRED"] },
  { key: "active",   label: "Hợp lệ",   statuses: ["ACTIVE"] },
  { key: "used",     label: "Đã dùng",  statuses: ["USED"] },
  { key: "inactive", label: "Không hợp lệ", statuses: ["CANCELLED", "EXPIRED"] },
];

const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    getMyTicketsAPI()
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((t) => {
    const tab = STATUS_TABS.find((s) => s.key === activeTab);
    return tab?.statuses.includes(t.status);
  });

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Vé của tôi</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {STATUS_TABS.map((tab) => (
          <TabPane tab={tab.label} key={tab.key}>
            {loading ? (
              <div style={styles.center}><Spin /></div>
            ) : filtered.length === 0 ? (
              <Empty description="Không có vé nào" style={styles.empty} />
            ) : (
              <div style={styles.list}>
                {filtered.map((ticket) => (
                  <TicketCard
                    key={ticket.ticketCode}
                    ticketCode={ticket.ticketCode}
                    eventTitle={ticket.eventTitle}
                    eventBannerUrl={ticket.eventBannerUrl}
                    eventStartTime={ticket.eventStartTime}
                    eventLocation={ticket.eventLocation}
                    ticketTypeName={ticket.ticketTypeName}
                    attendeeName={ticket.attendeeName}
                    status={ticket.status}
                  />
                ))}
              </div>
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default TicketsPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 900, margin: "0 auto", padding: "24px 24px 48px" },
  title: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 16 },
  center: { display: "flex", justifyContent: "center", padding: "40px 0" },
  empty: { padding: "40px 0" },
  list: { display: "flex", flexDirection: "column", gap: 12, marginTop: 16 },
};
