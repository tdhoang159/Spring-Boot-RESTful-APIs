import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ defaultValue = "", onSearch }) => {
  const [value, setValue] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = value.trim();
    if (onSearch) {
      onSearch(trimmed);
    } else {
      // Mặc định: navigate sang trang events với query
      navigate(`/events?keyword=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={styles.wrap}>
      <SearchOutlined style={styles.icon} />
      <input
        type="text"
        placeholder="Bạn tìm gì hôm nay?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.btn}>
        Tìm kiếm
      </button>
    </div>
  );
};

export default SearchBar;

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    height: 44,
    width: "100%",
  },
  icon: {
    padding: "0 12px",
    color: "#828BA0",
    fontSize: 16,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 14,
    color: "#2A2D34",
    backgroundColor: "transparent",
    minWidth: 0,
  },
  btn: {
    backgroundColor: "#2DC275",
    color: "#fff",
    border: "none",
    padding: "0 18px",
    height: "100%",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
};
