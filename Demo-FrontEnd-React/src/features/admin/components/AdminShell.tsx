import { NavLink, Outlet, useNavigate } from "react-router";
import { getCurrentUser, logout } from "../../auth/services/auth.service";

const menuItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Duyệt sự kiện", to: "/admin/event-approvals" },
  { label: "Quản lý Organizer", to: "/admin/organizers" },
  { label: "Quản lý User", to: "/admin/users" },
  { label: "Quản lý Categories", to: "/admin/categories" },
  { label: "Cấu hình Commission", to: "/admin/commissions" },
  { label: "Báo cáo hệ thống", to: "/admin/reports" },
  { label: "Quản lý thông báo", to: "/admin/notifications" },
];

const IconDot = () => (
  <svg className="admin-menu-icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2h7A2.5 2.5 0 0 1 16 4.5v11a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 15.5v-11Zm2.5-1A1 1 0 0 0 5.5 4.5v11a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-7ZM7 6h6v1.5H7V6Zm0 3.25h6v1.5H7v-1.5Zm0 3.25h4v1.5H7v-1.5Z" />
  </svg>
);

const AdminShell = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-shell font-outfit">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-mark">EA</div>
          <div>
            <div className="admin-logo-title">Event Admin</div>
            <div className="admin-logo-subtitle">TailAdmin Dashboard</div>
          </div>
        </div>
        <nav className="admin-menu">
          <div className="admin-menu-group-title">MENU</div>
          {menuItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/admin"} className={({ isActive }) => `admin-menu-item ${isActive ? "admin-menu-item-active" : ""}`}>
              <IconDot />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-content-area">
        <header className="admin-header">
          <div>
            <p className="admin-header-eyebrow">Event Management</p>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <div className="admin-user-chip">
              <span className="admin-avatar">{user?.fullName?.charAt(0) ?? "A"}</span>
              <span>{user?.fullName ?? "Administrator"}</span>
            </div>
            <button className="admin-btn admin-btn-outline" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
