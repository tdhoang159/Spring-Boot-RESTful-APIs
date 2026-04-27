import { useEffect, useState } from "react";
import { Spin, Empty, Tabs } from "antd";
import OrderCard from "../components/order/OrderCard";
import { getMyOrdersAPI } from "../services/order.api";
import type { Order, OrderStatus } from "../services/order.api";

const { TabPane } = Tabs;

const STATUS_TABS: { key: string; label: string; statuses: OrderStatus[] }[] = [
  { key: "all",       label: "Tất cả",      statuses: ["PENDING", "CONFIRMED", "EXPIRED", "CANCELLED"] },
  { key: "pending",   label: "Chờ xử lý",   statuses: ["PENDING"] },
  { key: "confirmed", label: "Đã xác nhận", statuses: ["CONFIRMED"] },
  { key: "expired",   label: "Hết hạn",     statuses: ["EXPIRED", "CANCELLED"] },
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    getMyOrdersAPI()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const tab = STATUS_TABS.find((t) => t.key === activeTab);
    return tab?.statuses.includes(o.orderStatus);
  });

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Đơn hàng của tôi</h2>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {STATUS_TABS.map((tab) => (
          <TabPane tab={tab.label} key={tab.key}>
            {loading ? (
              <div style={styles.center}><Spin /></div>
            ) : filtered.length === 0 ? (
              <Empty description="Không có đơn hàng nào" style={styles.empty} />
            ) : (
              <div style={styles.list}>
                {filtered.map((order) => (
                  <OrderCard
                    key={order.orderCode}
                    orderCode={order.orderCode}
                    eventTitle={order.eventTitle ?? "Sự kiện"}
                    eventBannerUrl={order.eventBannerUrl}
                    createdAt={order.createdAt}
                    totalAmount={order.totalAmount}
                    orderStatus={order.orderStatus}
                    paymentStatus={order.paymentStatus}
                    itemCount={order.items.reduce((s, i) => s + i.quantity, 0)}
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

export default OrdersPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 900, margin: "0 auto", padding: "24px 24px 48px" },
  title: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 16 },
  center: { display: "flex", justifyContent: "center", padding: "40px 0" },
  empty: { padding: "40px 0" },
  list: { display: "flex", flexDirection: "column", gap: 12, marginTop: 16 },
};
