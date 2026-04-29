import { Box, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";
import type { ReactNode } from "react";

type AuthPublicShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const AuthPublicShell = ({ title, subtitle, children }: AuthPublicShellProps) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f8fb", display: "flex", flexDirection: "column" }}>
      <Box
        component="header"
        sx={{
          px: { xs: 2, md: 4 },
          py: 2,
          borderBottom: "1px solid rgba(11,53,88,0.12)",
          bgcolor: "#fff",
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0B3558" }}>
            Event Hub
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/" variant="outlined" size="small">
              Về trang chủ
            </Button>
            <Button component={RouterLink} to="/events" variant="text" size="small">
              Xem sự kiện
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, px: 2, py: { xs: 4, md: 6 } }}>
        <Stack spacing={1.5} sx={{ maxWidth: 520, mx: "auto", mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
        </Stack>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          px: { xs: 2, md: 4 },
          py: 2,
          borderTop: "1px solid rgba(11,53,88,0.12)",
          bgcolor: "#fff",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            © 2026 Event Hub
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/login" size="small" variant="text">
              Đăng nhập
            </Button>
            <Button component={RouterLink} to="/register" size="small" variant="text">
              Đăng ký
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default AuthPublicShell;