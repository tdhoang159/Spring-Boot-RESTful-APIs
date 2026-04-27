import { useLocation, useNavigate } from "react-router";
import { Button, Result } from "antd";

interface SuccessState {
  orderCode?: string;
  amount?: number;
}

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as SuccessState;

  return (
    <div style={styles.wrap}>
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle={
          <div style={styles.sub}>
            {state.orderCode && (
              <div>Mã đơn hàng: <strong>{state.orderCode}</strong></div>
            )}
            {state.amount && (
              <div>
                Số tiền: <strong style={styles.amount}>
                  {state.amount.toLocaleString("vi-VN")}đ
                </strong>
              </div>
            )}
            <div style={styles.note}>
              Vé của bạn đã được gửi về email. Vui lòng kiểm tra hộp thư!
            </div>
          </div>
        }
        extra={[
          <Button
            key="tickets"
            type="primary"
            size="large"
            style={styles.primaryBtn}
            onClick={() => navigate("/tickets")}
          >
            Xem vé của tôi
          </Button>,
          <Button
            key="home"
            size="large"
            style={styles.secondaryBtn}
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccessPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 560, margin: "0 auto", padding: "48px 24px" },
  sub: { display: "flex", flexDirection: "column", gap: 8, fontSize: 15, color: "#555" },
  amount: { color: "#2DC275" },
  note: { fontSize: 13, color: "#828BA0", marginTop: 8 },
  primaryBtn: { backgroundColor: "#2DC275", borderColor: "#2DC275", borderRadius: 10, fontWeight: 700, height: 48 },
  secondaryBtn: { borderRadius: 10, height: 48 },
};
