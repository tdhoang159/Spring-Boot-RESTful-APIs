import { useEffect, useState } from "react";
import { Layout, Dropdown, Avatar, Space, Button } from "antd";
import type { MenuProps } from "antd";
import {
  LogoutOutlined,
  ShoppingOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import SearchBar from "./SearchBar";
import { clearAuthSession, getAuthUser, isAuthenticated, subscribeAuthChange, type AuthUser } from "../../lib/auth";

const { Header: AntHeader } = Layout;

// ── Types ─────────────────────────────────────────────────────────────────────
const PRIMARY_GREEN = "#2DC275";

// ── Header Component ──────────────────────────────────────────────────────────
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

  useEffect(() => {
    setUser(getAuthUser());
  }, [location.pathname, location.search]);

  useEffect(() => {
    return subscribeAuthChange(() => {
      setUser(getAuthUser());
    });
  }, []);

  const loggedIn = isAuthenticated() && !!user;

  const initials = user?.fullName
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // Dropdown menu items
  const accountMenuItems: MenuProps["items"] = [
    {
      key: "header",
      label: (
        <div style={styles.dropdownHeader}>
          <Avatar
            style={{ backgroundColor: PRIMARY_GREEN, fontWeight: 700 }}
            size={40}
          >
            {initials}
          </Avatar>
          <span style={styles.dropdownName}>{user?.fullName}</span>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "tickets",
      icon: <TagsOutlined />,
      label: "Vé của tôi",
      onClick: () => navigate("/tickets"),
    },
    {
      key: "orders",
      icon: <ShoppingOutlined />,
      label: "Đơn hàng của tôi",
      onClick: () => navigate("/orders"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: () => {
        clearAuthSession();
        navigate("/login", { replace: true });
      },
    },
  ];

  return (
    <AntHeader style={styles.header}>
      <div style={styles.inner}>
        {/* Logo */}
        <a href="/" style={styles.logo}>
          TicketBox
        </a>

        {/* Search bar */}
        <div style={styles.searchWrap}>
          <SearchBar />
        </div>

        {/* Right actions */}
        <Space size={12} align="center">
          {/* Vé của tôi */}
          <div
            style={styles.myTickets}
            onClick={() => navigate("/tickets")}
          >
            <TagsOutlined style={{ fontSize: 20, color: "white" }} />
            <span style={styles.myTicketsLabel}>Vé của tôi</span>
          </div>

          {/* Account */}
          {loggedIn ? (
            <Dropdown
              menu={{ items: accountMenuItems }}
              placement="bottomRight"
              trigger={["hover"]}
              overlayStyle={styles.dropdownOverlay}
            >
              <Space style={styles.accountTrigger}>
                <Avatar
                  style={{ backgroundColor: "rgba(255,255,255,0.25)", fontWeight: 700, fontSize: 13 }}
                  size={32}
                >
                  {initials}
                </Avatar>
                <span style={styles.accountLabel}>Tài khoản</span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button ghost onClick={() => navigate("/login")} style={styles.ghostBtn}>
                Đăng nhập
              </Button>
              <Button onClick={() => navigate("/events")} style={styles.registerBtn}>
                Xem sự kiện
              </Button>
            </Space>
          )}
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  header: {
    width: "100%",
    backgroundColor: "#2DC275",
    height: 76,
    lineHeight: "76px",
    padding: "0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  logo: {
    fontWeight: 800,
    fontSize: 22,
    color: "#fff",
    textDecoration: "none",
    letterSpacing: "-0.5px",
    flexShrink: 0,
    lineHeight: 1,
  },
  searchWrap: {
    flex: 1,
    maxWidth: 560,
  },
  myTickets: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    cursor: "pointer",
    lineHeight: 1,
  },
  myTicketsLabel: {
    fontSize: 11,
    color: "#fff",
    fontWeight: 500,
  },
  accountTrigger: {
    cursor: "pointer",
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1,
  },
  accountLabel: {
    color: "#fff",
  },
  dropdownOverlay: {
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    minWidth: 220,
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "4px 0",
  },
  dropdownName: {
    fontWeight: 600,
    fontSize: 14,
    color: "#2A2D34",
  },
  ghostBtn: {
    color: "#fff",
    borderColor: "#fff",
    borderRadius: 8,
    height: 40,
  },
  registerBtn: {
    backgroundColor: "#fff",
    color: "#2DC275",
    fontWeight: 700,
    border: "none",
    borderRadius: 8,
    height: 40,
  },
};
