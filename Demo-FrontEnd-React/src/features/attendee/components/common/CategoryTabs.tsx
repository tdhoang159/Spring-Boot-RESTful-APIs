import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { getEventCategoriesAPI, type EventCategory } from "../../services/event.api";

// ── Props ─────────────────────────────────────────────────────────────────────
interface CategoryTabsProps {
  onChange?: (categoryId: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
const CategoryTabs: React.FC<CategoryTabsProps> = ({ onChange }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<EventCategory[]>([]);

  const activeId = searchParams.get("categoryId") ?? "";

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const data = await getEventCategoriesAPI();
        if (isMounted) {
          setCategories(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

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
      navigate(`/events?${params.toString()}`);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.track}>
        {[{ id: "", label: "Tất cả" }, ...categories].map((cat) => {
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
};
