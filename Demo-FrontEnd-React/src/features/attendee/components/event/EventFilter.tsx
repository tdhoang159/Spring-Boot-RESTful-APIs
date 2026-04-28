import { Input, Select, DatePicker, Button, Row, Col } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

const { Option } = Select;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface FilterValues {
  keyword?: string;
  city?: string;
  categoryId?: string;
  date?: string;       // YYYY-MM-DD
  locationType?: "ONLINE" | "OFFLINE" | "HYBRID" | "";
}

interface EventFilterProps {
  initialValues?: FilterValues;
  onFilter: (values: FilterValues) => void;
  loading?: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CITIES = [
  "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ",
  "Huế", "Nha Trang", "Đà Lạt", "Hải Phòng",
];

const CATEGORIES = [
  { id: "music",   label: "Âm nhạc" },
  { id: "sport",   label: "Thể thao" },
  { id: "art",     label: "Nghệ thuật" },
  { id: "seminar", label: "Hội thảo" },
  { id: "food",    label: "Ẩm thực" },
  { id: "travel",  label: "Du lịch" },
];

// ── Component ─────────────────────────────────────────────────────────────────
const EventFilter: React.FC<EventFilterProps> = ({
  initialValues = {},
  onFilter,
  loading = false,
}) => {
  const [values, setValues] = useState<FilterValues>(initialValues);

  const set = (key: keyof FilterValues, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleReset = () => {
    setValues({});
    onFilter({});
  };

  const handleApply = () => onFilter(values);

  return (
    <div style={styles.wrap}>
      <Row gutter={[12, 12]} align="middle">
        {/* Keyword */}
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tên sự kiện..."
            prefix={<SearchOutlined style={{ color: "#828BA0" }} />}
            value={values.keyword ?? ""}
            onChange={(e) => set("keyword", e.target.value)}
            onPressEnter={handleApply}
            allowClear
            style={styles.input}
          />
        </Col>

        {/* City */}
        <Col xs={12} sm={6} md={4}>
          <Select
            placeholder="Thành phố"
            value={values.city || undefined}
            onChange={(v) => set("city", v)}
            allowClear
            style={styles.select}
          >
            {CITIES.map((c) => (
              <Option key={c} value={c}>{c}</Option>
            ))}
          </Select>
        </Col>

        {/* Category */}
        <Col xs={12} sm={6} md={4}>
          <Select
            placeholder="Danh mục"
            value={values.categoryId || undefined}
            onChange={(v) => set("categoryId", v)}
            allowClear
            style={styles.select}
          >
            {CATEGORIES.map((c) => (
              <Option key={c.id} value={c.id}>{c.label}</Option>
            ))}
          </Select>
        </Col>

        {/* Date */}
        <Col xs={12} sm={6} md={4}>
          <DatePicker
            placeholder="Chọn ngày"
            value={values.date ? dayjs(values.date) : null}
            onChange={(d: Dayjs | null) =>
              set("date", d ? d.format("YYYY-MM-DD") : "")
            }
            format="DD/MM/YYYY"
            style={styles.select}
          />
        </Col>

        {/* Location type */}
        <Col xs={12} sm={6} md={3}>
          <Select
            placeholder="Hình thức"
            value={values.locationType || undefined}
            onChange={(v) => set("locationType", v)}
            allowClear
            style={styles.select}
          >
            <Option value="OFFLINE">Trực tiếp</Option>
            <Option value="ONLINE">Online</Option>
          </Select>
        </Col>

        {/* Actions */}
        <Col xs={24} sm={24} md={3}>
          <div style={styles.actions}>
            <Button onClick={handleReset} style={styles.resetBtn}>
              Xoá lọc
            </Button>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleApply}
              loading={loading}
              style={styles.applyBtn}
            >
              Lọc
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EventFilter;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrap: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "16px 20px",
    marginBottom: 24,
    border: "1px solid #f0f0f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  input: {
    borderRadius: 8,
    height: 40,
  },
  select: {
    width: "100%",
    height: 40,
  },
  actions: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
  },
  resetBtn: {
    borderRadius: 8,
    height: 40,
  },
  applyBtn: {
    backgroundColor: "#2DC275",
    borderColor: "#2DC275",
    borderRadius: 8,
    height: 40,
    fontWeight: 600,
  },
};