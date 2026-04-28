import { useNavigate, useSearchParams } from "react-router";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  emoji: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: "",        label: "Tất cả",    emoji: "🎪" },
  { id: "music",   label: "Âm nhạc",  emoji: "🎵" },
  { id: "sport",   label: "Thể thao", emoji: "⚽" },
  { id: "art",     label: "Nghệ thuật", emoji: "🎭" },
  { id: "seminar", label: "Hội thảo", emoji: "🎤" },
  { id: "food",    label: "Ẩm thực",  emoji: "🍜" },
  { id: "travel",  label: "Du lịch",  emoji: "✈️" },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface CategoryTabsProps {
  onChange?: (categoryId: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const CategoryTabs: React.FC<CategoryTabsProps> = ({ onChange }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeId = searchParams.get("categoryId") ?? "";

  const handleClick = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      const params = new URLSearchParams(searchParams);
      if (id) {
        params.set("categoryId", id);
      } else {
        params.delete("categoryId");
      }
      navigate(`/attendee/events?${params.toString()}`);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.track}>
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              style={{
                ...styles.tab,
                ...(isActive ? styles.tabActive : {}),
              }}
            >
              <span style={styles.emoji}>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    overflowX: "auto",
    // Ẩn scrollbar nhưng vẫn scroll được trên mobile
    scrollbarWidth: "none",
  },
  track: {
    display: "flex",
    gap: 8,
    padding: "12px 0",
    minWidth: "max-content",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 18px",
    borderRadius: 999,
    border: "1.5px solid #e8e8e8",
    backgroundColor: "#fff",
    color: "#555",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.18s ease",
  },
  tabActive: {
    backgroundColor: "#2DC275",
    borderColor: "#2DC275",
    color: "#fff",
    fontWeight: 700,
  },
  emoji: {
    fontSize: 16,
  },
};
