import { useEffect, useState } from "react";
import { AdminBadge, AdminCard, AdminEmpty, AdminLoading, AdminModal, AdminPageHeader, AdminToast, SelectField, TextField } from "../components/admin-ui";
import { organizerApi } from "../services/organizerApi";
import type { UserRecord, UserStatus } from "../types/admin.types";

const OrganizerManagementPage = () => {
  const [items, setItems] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [viewing, setViewing] = useState<UserRecord | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", passwordHash: "", status: "ACTIVE" as UserStatus });
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const load = () => organizerApi.getOrganizers().then(setItems).catch(() => setToast({ type: "error", message: "Không tải được organizer" })).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const open = (organizer?: UserRecord) => {
    setEditing(organizer ?? { userId: 0, fullName: "", email: "" });
    setForm(organizer ? { fullName: organizer.fullName, email: organizer.email, phone: organizer.phone ?? "", passwordHash: "", status: organizer.status ?? "ACTIVE" } : { fullName: "", email: "", phone: "", passwordHash: "", status: "ACTIVE" });
  };

  const submit = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      setToast({ type: "error", message: "Tên và email là bắt buộc" });
      return;
    }
    try {
      if (editing?.userId) await organizerApi.updateOrganizer(editing.userId, form);
      else await organizerApi.createOrganizer(form);
      setToast({ type: "success", message: "Lưu organizer thành công" });
      setEditing(null);
      setLoading(true);
      await load();
    } catch {
      setToast({ type: "error", message: "Không lưu được organizer" });
    }
  };

  const remove = async (organizer: UserRecord) => {
    if (!window.confirm(`Xóa organizer ${organizer.fullName}?`)) return;
    try {
      await organizerApi.deleteOrganizer(organizer.userId);
      setItems((current) => current.filter((item) => item.userId !== organizer.userId));
      setToast({ type: "success", message: "Xóa organizer thành công" });
    } catch {
      setToast({ type: "error", message: "Không xóa được organizer" });
    }
  };

  return (
    <>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
      <AdminPageHeader title="Quản lý Organizer" description="Organizer được lấy từ user có role ORGANIZER." action={<button className="admin-btn admin-btn-primary" onClick={() => open()}>Thêm organizer</button>} />
      <AdminCard>{loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="Chưa có organizer." /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Tên</th><th>Email</th><th>Phone</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{items.map((item) => <tr key={item.userId}><td>{item.fullName}</td><td>{item.email}</td><td>{item.phone ?? "-"}</td><td><AdminBadge tone={item.status === "ACTIVE" ? "success" : "gray"}>{item.status ?? "ACTIVE"}</AdminBadge></td><td className="admin-actions"><button onClick={() => setViewing(item)}>Xem</button><button onClick={() => open(item)}>Sửa</button><button onClick={() => void remove(item)}>Xóa</button></td></tr>)}</tbody></table></div>}</AdminCard>
      {editing && <AdminModal title={editing.userId ? "Cập nhật organizer" : "Thêm organizer"} onClose={() => setEditing(null)}><div className="admin-form-grid"><TextField label="Họ tên" value={form.fullName} onChange={(fullName) => setForm({ ...form, fullName })} required /><TextField label="Email" value={form.email} onChange={(email) => setForm({ ...form, email })} required type="email" /><TextField label="Số điện thoại" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} /><TextField label="Password hash" value={form.passwordHash} onChange={(passwordHash) => setForm({ ...form, passwordHash })} /><SelectField label="Status" value={form.status} onChange={(status) => setForm({ ...form, status: status as UserStatus })} options={["ACTIVE", "INACTIVE", "SUSPENDED"]} /></div><div className="admin-modal-actions"><button className="admin-btn admin-btn-outline" onClick={() => setEditing(null)}>Hủy</button><button className="admin-btn admin-btn-primary" onClick={() => void submit()}>Lưu</button></div></AdminModal>}
      {viewing && <AdminModal title="Chi tiết organizer" onClose={() => setViewing(null)}><div className="admin-detail-list"><p><b>ID:</b> {viewing.userId}</p><p><b>Tên:</b> {viewing.fullName}</p><p><b>Email:</b> {viewing.email}</p><p><b>Phone:</b> {viewing.phone ?? "-"}</p></div></AdminModal>}
    </>
  );
};

export default OrganizerManagementPage;
