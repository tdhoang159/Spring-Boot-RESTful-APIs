import { useEffect, useState, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface CountdownTimerProps {
  durationSeconds: number;   // tổng số giây đếm ngược (mặc định 600 = 10 phút)
  onExpire?: () => void;     // callback khi hết giờ
  warningSeconds?: number;   // số giây còn lại để đổi sang màu đỏ (mặc định 60)
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, "0");

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
};

// ── Component ─────────────────────────────────────────────────────────────────
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  durationSeconds = 600,
  onExpire,
  warningSeconds = 60,
}) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isExpired = remaining === 0;
  const isWarning = remaining <= warningSeconds && !isExpired;
  const progress = remaining / durationSeconds; // 1 → 0

  const color = isExpired
    ? "#ff4d4f"
    : isWarning
    ? "#fa8c16"
    : "#2DC275";

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>
        {isExpired ? "⏰ Đã hết thời gian" : "Thời gian còn lại"}
      </div>

      {/* Circular progress */}
      <div style={styles.circleWrap}>
        <svg width={96} height={96} viewBox="0 0 96 96">
          {/* Track */}
          <circle
            cx={48} cy={48} r={40}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth={6}
          />
          {/* Progress */}
          <circle
            cx={48} cy={48} r={40}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress)}`}
            transform="rotate(-90 48 48)"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
          />
        </svg>

        {/* Time text in center */}
        <div style={{ ...styles.timeText, color }}>
          {formatTime(remaining)}
        </div>
      </div>

      {isWarning && !isExpired && (
        <div style={styles.warning}>
          Vui lòng hoàn tất thanh toán sớm!
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: "#828BA0",
    fontWeight: 500,
  },
  circleWrap: {
    position: "relative",
    width: 96,
    height: 96,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    position: "absolute",
    fontSize: 18,
    fontWeight: 800,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.5px",
  },
  warning: {
    fontSize: 12,
    color: "#fa8c16",
    fontWeight: 600,
    textAlign: "center",
  },
};
