import { useEffect, useState } from "react";
import { AdminBadge, AdminCard, AdminEmpty, AdminLoading, AdminModal, AdminPageHeader, AdminToast, SelectField, TextField } from "../components/admin-ui";
import { commissionApi } from "../services/commissionApi";
import type { CommissionConfig, CommissionStatus, CommissionType } from "../types/admin.types";

const CommissionConfigPage = () => {
  const [items, setItems] = useState<CommissionConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CommissionConfig | null>(null);
  const [form, setForm] = useState({ commissionName: "", commissionType: "PERCENT" as CommissionType, commissionValue: "", status: "ACTIVE" as CommissionStatus });
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const load = () => commissionApi.getCommissionConfigs().then(setItems).catch(() => setToast({ type: "error", message: "Chưa có endpoint commission. Kiểm tra TODO trong commissionApi.ts" })).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const open = (item?: CommissionConfig) => {
    setEditing(item ?? { commissionId: 0, commissionName: "", commissionType: "PERCENT", commissionValue: 0 });
    setForm(item ? { commissionName: item.commissionName, commissionType: item.commissionType, commissionValue: String(item.commissionValue), status: item.status ?? "ACTIVE" } : { commissionName: "", commissionType: "PERCENT", commissionValue: "", status: "ACTIVE" });
  };

  const submit = async () => {
    const value = Number(form.commissionValue);
    if (!form.commissionName.trim() || Number.isNaN(value) || value < 0 || (form.commissionType === "PERCENT" && value > 100)) {
      setToast({ type: "error", message: "Commission không hợp lệ" });
      return;
    }
    try {
      const payload = { ...form, commissionValue: value };
      if (editing?.commissionId) await commissionApi.updateCommissionConfig(editing.commissionId, payload);
      else await commissionApi.createCommissionConfig(payload);
      setToast({ type: "success", message: "Lưu commission thành công" });
      setEditing(null);
      setLoading(true);
      await load();
    } catch {
      setToast({ type: "error", message: "Không lưu được commission. Cần backend endpoint tương ứng." });
    }
  };

  const remove = async (item: CommissionConfig) => {
    if (!window.confirm(`Xóa cấu hình ${item.commissionName}?`)) return;
    try {
      await commissionApi.deleteCommissionConfig(item.commissionId);
      setItems((current) => current.filter((config) => config.commissionId !== item.commissionId));
      setToast({ type: "success", message: "Xóa commission thành công" });
    } catch {
      setToast({ type: "error", message: "Không xóa được commission" });
    }
  };

  return (
    <>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
      <AdminPageHeader title="Cấu hình Commission" description="Trang đã tách service riêng, cần backend endpoint nếu chưa có." action={<button className="admin-btn admin-btn-primary" onClick={() => open()}>Thêm commission</button>} />
      <AdminCard>{loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="Chưa có cấu hình commission hoặc endpoint chưa sẵn sàng." /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Tên</th><th>Loại</th><th>Giá trị</th><th>Status</th><th>Thao tác</th></tr></thead><tbody>{items.map((item) => <tr key={item.commissionId}><td>{item.commissionName}</td><td>{item.commissionType}</td><td>{item.commissionValue}</td><td><AdminBadge tone={item.status === "ACTIVE" ? "success" : "gray"}>{item.status ?? "ACTIVE"}</AdminBadge></td><td className="admin-actions"><button onClick={() => open(item)}>Sửa</button><button onClick={() => void remove(item)}>Xóa</button></td></tr>)}</tbody></table></div>}</AdminCard>
      {editing && <AdminModal title={editing.commissionId ? "Cập nhật commission" : "Thêm commission"} onClose={() => setEditing(null)}><div className="admin-form-grid"><TextField label="Tên cấu hình" value={form.commissionName} onChange={(commissionName) => setForm({ ...form, commissionName })} required /><SelectField label="Loại" value={form.commissionType} onChange={(commissionType) => setForm({ ...form, commissionType: commissionType as CommissionType })} options={["PERCENT", "FIXED"]} /><TextField label="Giá trị" value={form.commissionValue} onChange={(commissionValue) => setForm({ ...form, commissionValue })} required type="number" /><SelectField label="Status" value={form.status} onChange={(status) => setForm({ ...form, status: status as CommissionStatus })} options={["ACTIVE", "INACTIVE"]} /></div><div className="admin-modal-actions"><button className="admin-btn admin-btn-outline" onClick={() => setEditing(null)}>Hủy</button><button className="admin-btn admin-btn-primary" onClick={() => void submit()}>Lưu</button></div></AdminModal>}
    </>
  );
};

export default CommissionConfigPage;
