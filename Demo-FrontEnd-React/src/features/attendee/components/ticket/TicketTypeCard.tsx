import { Button, InputNumber } from "antd";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface TicketTypeCardProps {
  id: number;
  name: string;
  description?: string;
  price: number;
  availableQuantity: number;
  maxPerOrder?: number;
  saleStart?: string;
  saleEnd?: string;
  onSelect?: (id: number, quantity: number) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (p: number) =>
  p === 0 ? "Miễn phí" : p.toLocaleString("vi-VN") + "đ";

const isSaleOpen = (start?: string, end?: string) => {
  const now = Date.now();
  if (start && new Date(start).getTime() > now) return false;
  if (end && new Date(end).getTime() < now) return false;
  return true;
};

// ── Component ─────────────────────────────────────────────────────────────────
const TicketTypeCard: React.FC<TicketTypeCardProps> = ({
  id,
  name,
  description,
  price,
  availableQuantity,
  maxPerOrder = 10,
  saleStart,
  saleEnd,
  onSelect,
}) => {
  const [quantity, setQuantity] = useState(1);

  const saleOpen = isSaleOpen(saleStart, saleEnd);
  const isSoldOut = availableQuantity === 0;
  const disabled = !saleOpen || isSoldOut;

  const statusLabel = isSoldOut
    ? "Hết vé"
    : !saleOpen
    ? "Chưa mở bán"
    : `Còn ${availableQuantity} vé`;

  const statusColor = isSoldOut
    ? "#ff4d4f"
    : !saleOpen
    ? "#828BA0"
    : "#2DC275";

  return (
    <div style={{ ...styles.wrap, opacity: disabled ? 0.6 : 1 }}>
      <div style={styles.left}>
        {/* Name & description */}
        <div style={styles.name}>{name}</div>
        {description && <div style={styles.desc}>{description}</div>}

        {/* Status */}
        <div style={{ ...styles.status, color: statusColor }}>
          {statusLabel}
        </div>
      </div>

      <div style={styles.right}>
        {/* Price */}
        <div style={styles.price}>{formatPrice(price)}</div>

        {/* Quantity + CTA */}
        {!disabled && (
          <div style={styles.controls}>
            <InputNumber
              min={1}
              max={Math.min(maxPerOrder, availableQuantity)}
              value={quantity}
              onChange={(v) => setQuantity(v ?? 1)}
              size="small"
              style={styles.quantityInput}
              controls
            />
            <Button
              type="primary"
              size="small"
              style={styles.selectBtn}
              onClick={() => onSelect?.(id, quantity)}
            >
              Chọn
            </Button>
          </div>
        )}

        {disabled && (
          <div style={styles.disabledLabel}>{statusLabel}</div>
        )}
      </div>
    </div>
  );
};

export default TicketTypeCard;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "1px solid #f0f0f0",
    transition: "box-shadow 0.18s ease",
  },
  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  },
  name: {
    fontWeight: 700,
    fontSize: 15,
    color: "#1a1a2e",
  },
  desc: {
    fontSize: 13,
    color: "#828BA0",
    lineHeight: 1.4,
  },
  status: {
    fontSize: 12,
    fontWeight: 600,
    marginTop: 2,
  },
  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
    flexShrink: 0,
  },
  price: {
    fontWeight: 800,
    fontSize: 17,
    color: "#2DC275",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  quantityInput: {
    width: 72,
    borderRadius: 6,
  },
  selectBtn: {
    backgroundColor: "#2DC275",
    borderColor: "#2DC275",
    borderRadius: 6,
    fontWeight: 600,
    minWidth: 64,
  },
  disabledLabel: {
    fontSize: 12,
    color: "#bbb",
    fontWeight: 600,
  },
};
