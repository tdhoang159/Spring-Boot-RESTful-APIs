import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router";
import { getCurrentUser, logout } from "../../features/auth/services/auth.service";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const organizerItems = [
    { label: "Trang chủ", to: "/organizer" },
    { label: "Tạo sự kiện", to: "/organizer/create-event" },
    { label: "Sự kiện của tôi", to: "/organizer/events" },
    { label: "Xem người đăng ký", to: "/organizer/registrations" },
    { label: "Quét vé", to: "/organizer/checkin" },
    { label: "Gửi email", to: "/organizer/send-email" },
    { label: "Lịch sử email", to: "/organizer/email-history" },
    { label: "Báo cáo", to: "/organizer/sales-report" },
  ];

  const attendeeItems = [
    { label: "Trang chủ", to: "/attendee" },
    { label: "Sự kiện", to: "/attendee/events" },
    { label: "Đơn hàng của tôi", to: "/attendee/orders" },
    { label: "Vé của tôi", to: "/attendee/tickets" },
  ];

  const items = user?.role === "ORGANIZER" ? organizerItems : attendeeItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(140deg, #F6F9FC 0%, #E8F6FF 100%)" }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#0B3558" }}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {user?.role === "ORGANIZER" ? "Organizer Portal" : "Attendee Portal"}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", maxWidth: "70vw" }}>
            {items.map((item) => (
              <Button
                key={item.to}
                component={RouterLink}
                to={item.to}
                color="inherit"
                variant={location.pathname === item.to ? "contained" : "text"}
                sx={{
                  borderRadius: 999,
                  bgcolor: location.pathname === item.to ? "rgba(255,255,255,0.18)" : "transparent",
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Button variant="outlined" color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppLayout;
