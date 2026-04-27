import { useNavigate, useSearchParams } from "react-router";
import { Spin, message } from "antd";
import QRDisplay from "../components/payment/QRDisplay";
import CountdownTimer from "../components/payment/CountdownTimer";
import PaymentStatusCard from "../components/payment/PaymentStatusCard";
import { usePaymentPolling } from "../hooks/use-payment-polling";

const PaymentPage: React.FC = () => {
  const PAYMENT_DURATION = 600;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get("orderId"));
  const orderCode = searchParams.get("orderCode") ?? "";
  const totalAmount = Number(searchParams.get("amount") ?? "0");

  const { qrData, status, loading, retry } = usePaymentPolling({
    orderId: Number.isFinite(orderId) ? orderId : undefined,
    onPaid: () => {
      window.setTimeout(() => {
        navigate("/payment/success", {
          state: { orderCode, amount: totalAmount },
        });
      }, 2000);
    },
  });

  const handleExpire = () => {
    // UI only, server timeout handled by polling response/scheduler
  };

  const handleRetry = async () => {
    try {
      await retry();
    } catch {
      message.error("Không thể tạo lại mã QR, vui lòng thử lại");
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <Spin size="large" tip="Đang tạo mã thanh toán..." />
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Thanh toán</h2>

      <div style={styles.content}>
        {/* Left - QR + countdown */}
        <div style={styles.left}>
          {qrData && status === "WAITING" && (
            <>
              <QRDisplay
                base64={qrData.qrUrl}
                size={220}
                label="Quét mã QR bằng app ngân hàng để thanh toán"
                showDownload
              />
              <div style={styles.divider} />
              <CountdownTimer
                durationSeconds={PAYMENT_DURATION}
                onExpire={handleExpire}
                warningSeconds={60}
              />
              <div style={styles.hint}>
                Chuyển khoản với nội dung:{" "}
                <strong style={styles.desc}>{qrData.description}</strong>
              </div>
            </>
          )}

          {status !== "WAITING" && (
            <PaymentStatusCard
              state={status}
              orderCode={qrData?.orderCode ?? orderCode}
              totalAmount={totalAmount}
              onRetry={handleRetry}
            />
          )}
        </div>

        {/* Right - order summary */}
        {qrData && (
          <div style={styles.right}>
            <div style={styles.summaryBox}>
              <div style={styles.summaryTitle}>Thông tin thanh toán</div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Mã đơn hàng</span>
                <span style={styles.summaryValue}>{qrData.orderCode ?? orderCode}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Số tiền</span>
                <span style={styles.summaryAmount}>
                  {totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Ngân hàng</span>
                <span style={styles.summaryValue}>Vietcombank</span>
              </div>
              <div style={styles.bankInfo}>
                Chuyển khoản đúng số tiền và nội dung để hệ thống tự động xác nhận
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 900, margin: "0 auto", padding: "24px 24px 48px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400, flexDirection: "column", gap: 16 },
  title: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 24 },
  content: { display: "flex", gap: 32, alignItems: "flex-start" },
  left: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 },
  right: { width: 300, flexShrink: 0 },
  divider: { width: "100%", borderTop: "1px dashed #f0f0f0" },
  hint: { fontSize: 13, color: "#828BA0", textAlign: "center", lineHeight: 1.6 },
  desc: { color: "#1a1a2e", wordBreak: "break-all" },
  summaryBox: { backgroundColor: "#fff", border: "1px solid #f0f0f0", borderRadius: 16, padding: "20px" },
  summaryTitle: { fontWeight: 700, fontSize: 15, color: "#1a1a2e", marginBottom: 16 },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 14 },
  summaryLabel: { color: "#828BA0" },
  summaryValue: { fontWeight: 600, color: "#1a1a2e" },
  summaryAmount: { fontWeight: 800, fontSize: 18, color: "#2DC275" },
  bankInfo: { marginTop: 16, padding: "12px", backgroundColor: "#f8fffe", borderRadius: 8, fontSize: 12, color: "#828BA0", lineHeight: 1.6 },
};
