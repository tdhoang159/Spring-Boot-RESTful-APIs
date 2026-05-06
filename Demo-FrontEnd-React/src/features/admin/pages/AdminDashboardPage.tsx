import { useEffect, useState } from "react";
import { AdminCard, AdminLoading, AdminPageHeader, AdminStatCard } from "../components/admin-ui";
import { reportApi } from "../services/reportApi";
import type { SystemReport } from "../types/admin.types";

const formatCurrency = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

const AdminDashboardPage = () => {
  const [report, setReport] = useState<SystemReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportApi.getSystemReport().then(setReport).finally(() => setLoading(false));
  }, []);

  if (loading || !report) return <AdminLoading />;

  const approvedPercent = report.totalEvents ? Math.round((report.approvedEvents / report.totalEvents) * 100) : 0;

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Tổng quan vận hành hệ thống Event Management." />
      <div className="admin-stat-grid">
        <AdminStatCard label="Tổng user" value={report.totalUsers} />
        <AdminStatCard label="Organizer" value={report.totalOrganizers} tone="success" />
        <AdminStatCard label="Tổng event" value={report.totalEvents} tone="brand" />
        <AdminStatCard label="Chờ duyệt" value={report.pendingEvents} tone="warning" />
        <AdminStatCard label="Doanh thu" value={formatCurrency(report.totalRevenue)} tone="success" />
        <AdminStatCard label="Commission" value={formatCurrency(report.totalCommission)} tone="brand" />
      </div>
      <div className="admin-grid-2">
        <AdminCard>
          <h3 className="admin-card-title">Tỷ lệ duyệt sự kiện</h3>
          <div className="admin-donut" style={{ background: `conic-gradient(#465fff ${approvedPercent}%, #e4e7ec 0)` }}>
            <span>{approvedPercent}%</span>
          </div>
        </AdminCard>
        <AdminCard>
          <h3 className="admin-card-title">Trạng thái sự kiện</h3>
          <div className="admin-bars">
            <div><span>Đã duyệt</span><strong style={{ width: `${approvedPercent}%` }} /></div>
            <div><span>Chờ duyệt</span><strong style={{ width: `${report.totalEvents ? Math.round((report.pendingEvents / report.totalEvents) * 100) : 0}%` }} /></div>
          </div>
        </AdminCard>
      </div>
    </>
  );
};

export default AdminDashboardPage;
