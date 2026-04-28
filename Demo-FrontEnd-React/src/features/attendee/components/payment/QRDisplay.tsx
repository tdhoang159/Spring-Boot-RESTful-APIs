import { Button, Tooltip } from "antd";
import { DownloadOutlined, CopyOutlined } from "@ant-design/icons";

// ── Types ─────────────────────────────────────────────────────────────────────
interface QRDisplayProps {
  base64: string;          // data:image/png;base64,... hoặc chỉ chuỗi base64
  size?: number;
  label?: string;
  showDownload?: boolean;
  showCopy?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const toSrc = (base64: string) =>
  base64.startsWith("data:") || base64.startsWith("http")
    ? base64
    : `data:image/png;base64,${base64}`;

// ── Component ─────────────────────────────────────────────────────────────────
const QRDisplay: React.FC<QRDisplayProps> = ({
  base64,
  size = 220,
  label,
  showDownload = true,
  showCopy = false,
}) => {
  const src = toSrc(base64);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = "qr-thanh-toan.png";
    a.click();
  };

  const handleCopy = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
    } catch {
      // fallback: copy URL
      await navigator.clipboard.writeText(src);
    }
  };

  return (
    <div style={styles.wrap}>
      {/* QR frame */}
      <div style={{ ...styles.frame, width: size + 32, height: size + 32 }}>
        <img
          src={src}
          alt="QR thanh toán"
          width={size}
          height={size}
          style={styles.image}
        />
      </div>

      {/* Label */}
      {label && <div style={styles.label}>{label}</div>}

      {/* Actions */}
      {(showDownload || showCopy) && (
        <div style={styles.actions}>
          {showDownload && (
            <Tooltip title="Tải QR về máy">
              <Button
                icon={<DownloadOutlined />}
                size="small"
                style={styles.actionBtn}
                onClick={handleDownload}
              >
                Tải QR
              </Button>
            </Tooltip>
          )}
          {showCopy && (
            <Tooltip title="Sao chép ảnh QR">
              <Button
                icon={<CopyOutlined />}
                size="small"
                style={styles.actionBtn}
                onClick={handleCopy}
              >
                Sao chép
              </Button>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default QRDisplay;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  frame: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    display: "block",
    imageRendering: "pixelated",
  },
  label: {
    fontSize: 13,
    color: "#828BA0",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: 8,
  },
  actionBtn: {
    borderRadius: 6,
  },
};
