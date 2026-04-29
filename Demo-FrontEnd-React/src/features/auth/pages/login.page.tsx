import { useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router";
import { getCurrentUser, getHomePathByRole, login } from "../services/auth.service";
import AuthPublicShell from "../components/auth-public-shell";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const redirectTo = (location.state as { from?: string } | null)?.from;

  const canSubmit = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password]);

  const handleSubmit = async () => {
    const result = await login({ email, password });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    const user = getCurrentUser();
    if (user) {
      navigate(redirectTo || getHomePathByRole(user.role), { replace: true });
      return;
    }

    navigate(redirectTo || "/", { replace: true });
  };

  return (
    <AuthPublicShell title="Đăng nhập" subtitle="Đăng nhập để tiếp tục đặt vé hoặc quản lý sự kiện.">
      <Box className="auth-page-wrap">
        <Card className="auth-card" elevation={0}>
          <CardContent>
            <Stack spacing={2.5}>
              {error ? <Alert severity="error">{error}</Alert> : null}
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <Button variant="contained" size="large" disabled={!canSubmit} onClick={handleSubmit}>
                Đăng nhập
              </Button>
              <Typography color="text.secondary">
                Chưa có tài khoản? <RouterLink to="/register">Tạo tài khoản</RouterLink>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </AuthPublicShell>
  );
};

export default LoginPage;
