import { Form, Input, Button, Divider, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CheckoutFormValues {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
}

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => Promise<void> | void;
  loading?: boolean;
  totalAmount: number;
  ticketTypeName: string;
  quantity: number;
  unitPrice: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN") + "đ";

const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/;

// ── Component ─────────────────────────────────────────────────────────────────
const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  loading = false,
  totalAmount,
  ticketTypeName,
  quantity,
  unitPrice,
}) => {
  const [form] = Form.useForm<CheckoutFormValues>();

  const handleFinish = async (values: CheckoutFormValues) => {
    await onSubmit(values);
  };

  return (
    <div style={styles.wrap}>
      {/* Order summary */}
      <div style={styles.summary}>
        <div style={styles.summaryTitle}>Thông tin đơn hàng</div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>{ticketTypeName}</span>
          <span style={styles.summaryValue}>
            {quantity} x {formatPrice(unitPrice)}
          </span>
        </div>
        <Divider style={{ margin: "12px 0" }} />
        <div style={styles.summaryRow}>
          <span style={styles.totalLabel}>Tổng cộng</span>
          <span style={styles.totalValue}>{formatPrice(totalAmount)}</span>
        </div>
      </div>

      {/* Buyer info form */}
      <div style={styles.formWrap}>
        <div style={styles.formTitle}>Thông tin người mua</div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          onFinishFailed={() => {
            message.warning("Vui lòng kiểm tra lại thông tin trước khi đặt vé");
          }}
          requiredMark={false}
        >
          <Form.Item
            name="buyerName"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" },
              { min: 2, message: "Họ và tên tối thiểu 2 ký tự" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={styles.inputIcon} />}
              placeholder="Nguyễn Văn A"
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="buyerEmail"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={styles.inputIcon} />}
              placeholder="example@email.com"
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="buyerPhone"
            label="Số điện thoại"
            rules={[
              {
                validator: (_, value: string | undefined) => {
                  const normalized = value?.trim();
                  if (!normalized) {
                    return Promise.resolve();
                  }
                  if (PHONE_REGEX.test(normalized)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Số điện thoại không hợp lệ"));
                },
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={styles.inputIcon} />}
              placeholder="0901234567"
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="button"
              size="large"
              block
              loading={loading}
              onClick={() => form.submit()}
              style={styles.submitBtn}
            >
              Đặt vé — {formatPrice(totalAmount)}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutForm;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  // Summary
  summary: {
    backgroundColor: "#f8fffe",
    border: "1px solid #e6f7f0",
    borderRadius: 12,
    padding: "16px 20px",
  },
  summaryTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a2e",
    marginBottom: 12,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
  },
  summaryLabel: {
    color: "#555",
  },
  summaryValue: {
    color: "#1a1a2e",
    fontWeight: 500,
  },
  totalLabel: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a2e",
  },
  totalValue: {
    fontWeight: 800,
    fontSize: 18,
    color: "#2DC275",
  },
  // Form
  formWrap: {
    backgroundColor: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 12,
    padding: "20px 24px",
  },
  formTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a2e",
    marginBottom: 20,
  },
  inputIcon: {
    color: "#828BA0",
  },
  input: {
    borderRadius: 8,
  },
  submitBtn: {
    backgroundColor: "#2DC275",
    borderColor: "#2DC275",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 16,
    height: 50,
  },
};
