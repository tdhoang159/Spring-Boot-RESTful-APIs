import { useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router";
import { getCurrentUser, getHomePathByRole, login } from "../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => email.trim().length > 0 && password.trim().length > 0, [email, password]);

  const handleSubmit = () => {
    const result = login({ email, password });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    const user = getCurrentUser();
    if (user) {
      navigate(getHomePathByRole(user.role));
      return;
    }

    navigate("/");
  };

  return (
    <Box className="auth-page-wrap">
      <Card className="auth-card" elevation={0}>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Login
            </Typography>
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
  );
};

export default LoginPage;
