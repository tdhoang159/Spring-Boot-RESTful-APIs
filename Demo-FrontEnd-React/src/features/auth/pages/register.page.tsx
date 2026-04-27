import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router";
import { register } from "../services/auth.service";
import type { UserRole } from "../services/auth.service";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("ATTENDEE");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return fullName.trim().length >= 2 && email.trim().length > 0 && password.trim().length >= 6;
  }, [fullName, email, password]);

  const handleSubmit = () => {
    const result = register({ fullName, email, password, role });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/login");
  };

  return (
    <Box className="auth-page-wrap">
      <Card className="auth-card" elevation={0}>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Register
            </Typography>
            <Typography color="text.secondary">Đăng ký tài khoản cho Người tham dự hoặc Người tổ chức.</Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField
              label="Password (min 6 chars)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <TextField select label="Role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} fullWidth>
              <MenuItem value="ATTENDEE">Người tham dự</MenuItem>
              <MenuItem value="ORGANIZER">Người tổ chức</MenuItem>
            </TextField>
            <Button variant="contained" size="large" disabled={!canSubmit} onClick={handleSubmit}>
              Đăng ký
            </Button>
            <Typography color="text.secondary">
              Đã có tài khoản? <RouterLink to="/login">Đăng nhập ngay</RouterLink>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
