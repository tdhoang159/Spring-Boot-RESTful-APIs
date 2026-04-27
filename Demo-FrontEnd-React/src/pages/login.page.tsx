import { useState } from "react";
import { Alert, Button, Card, Form, Input, Typography, message } from "antd";
import { useLocation, useNavigate } from "react-router";
import { loginAPI } from "../services/auth.api";
import { setAuthSession } from "../lib/auth";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTarget =
    new URLSearchParams(location.search).get("redirect") || "/";

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const session = await loginAPI(values);
      setAuthSession(session);
      message.success("Đăng nhập thành công");
      navigate(redirectTarget, { replace: true });
    } catch (err: any) {
      const nextError =
        err?.response?.data?.message ?? "Đăng nhập thất bại, vui lòng thử lại";
      setError(nextError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Card style={styles.card}>
        <Typography.Title level={2} style={styles.title}>
          Đăng nhập
        </Typography.Title>
        <Typography.Paragraph style={styles.subtitle}>
          Sử dụng tài khoản người tham dự để tiếp tục đặt vé và thanh toán.
        </Typography.Paragraph>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={styles.alert}
          />
        )}

        <Form<LoginFormValues> layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
            style={styles.button}
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 160px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    background:
      "linear-gradient(180deg, rgba(45,194,117,0.08) 0%, rgba(255,255,255,1) 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    borderRadius: 20,
    boxShadow: "0 16px 50px rgba(16, 24, 40, 0.08)",
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#667085",
    marginBottom: 24,
  },
  alert: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    height: 46,
    borderRadius: 10,
    fontWeight: 700,
    backgroundColor: "#2DC275",
  },
};
