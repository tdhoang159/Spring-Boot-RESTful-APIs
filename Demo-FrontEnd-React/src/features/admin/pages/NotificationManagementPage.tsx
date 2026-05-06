import { useEffect, useState } from "react";
import { AdminBadge, AdminCard, AdminEmpty, AdminLoading, AdminModal, AdminPageHeader, AdminToast, SelectField, TextAreaField, TextField } from "../components/admin-ui";
import { notificationApi } from "../services/notificationApi";
import type { NotificationRecord, NotificationType, UserRole } from "../types/admin.types";

const NotificationManagementPage = () => {
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NotificationRecord | null>(null);
  const [form, setForm] = useState({ title: "", message: "", type: "SYSTEM" as NotificationType, targetRole: "ALL" as UserRole | "ALL" });
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const load = () => notificationApi.getNotifications().then(setItems).catch(() => setToast({ type: "error", message: "Chưa có endpoint notification. Kiểm tra TODO trong notificationApi.ts" })).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const open = (item?: NotificationRecord) => {
    setEditing(item ?? { notificationId: 0, title: "", message: "" });
    setForm(item ? { title: item.title, message: item.message, type: item.type ?? "SYSTEM", targetRole: item.targetRole ?? "ALL" } : { title: "", message: "", type: "SYSTEM", targetRole: "ALL" });
  };

  const submit = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      setToast({ type: "error", message: "Tiêu đề và nội dung là bắt buộc" });
      return;
    }
    try {
      if (editing?.notificationId) await notificationApi.updateNotification(editing.notificationId, form);
      else await notificationApi.createNotification(form);
      setToast({ type: "success", message: "Lưu thông báo thành công" });
      setEditing(null);
      setLoading(true);
      await load();
    } catch {
      setToast({ type: "error", message: "Không lưu được thông báo. Cần backend endpoint tương ứng." });
    }
  };

  const remove = async (item: NotificationRecord) => {
    if (!window.confirm(`Xóa thông báo ${item.title}?`)) return;
    try {
      await notificationApi.deleteNotification(item.notificationId);
      setItems((current) => current.filter((notification) => notification.notificationId !== item.notificationId));
      setToast({ type: "success", message: "Xóa thông báo thành công" });
    } catch {
      setToast({ type: "error", message: "Không xóa được thông báo" });
    }
  };

  return (
    <>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
      <AdminPageHeader title="Quản lý thông báo" description="Tạo và gửi thông báo toàn hệ thống hoặc theo role nếu backend hỗ trợ." action={<button className="admin-btn admin-btn-primary" onClick={() => open()}>Tạo thông báo</button>} />
      <AdminCard>{loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="Chưa có thông báo hoặc endpoint chưa sẵn sàng." /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Tiêu đề</th><th>Loại</th><th>Target</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead><tbody>{items.map((item) => <tr key={item.notificationId}><td>{item.title}</td><td><AdminBadge tone="brand">{item.type ?? "SYSTEM"}</AdminBadge></td><td>{item.targetRole ?? item.userId ?? "ALL"}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "-"}</td><td className="admin-actions"><button onClick={() => open(item)}>Sửa</button><button onClick={() => void remove(item)}>Xóa</button></td></tr>)}</tbody></table></div>}</AdminCard>
      {editing && <AdminModal title={editing.notificationId ? "Cập nhật thông báo" : "Tạo thông báo"} onClose={() => setEditing(null)}><div className="admin-form-grid"><TextField label="Tiêu đề" value={form.title} onChange={(title) => setForm({ ...form, title })} required /><SelectField label="Loại" value={form.type} onChange={(type) => setForm({ ...form, type: type as NotificationType })} options={["SYSTEM", "EVENT", "PAYMENT", "PROMOTION"]} /><SelectField label="Gửi đến" value={form.targetRole} onChange={(targetRole) => setForm({ ...form, targetRole: targetRole as UserRole | "ALL" })} options={["ALL", "ADMIN", "ORGANIZER", "ATTENDEE"]} /><TextAreaField label="Nội dung" value={form.message} onChange={(message) => setForm({ ...form, message })} required /></div><div className="admin-modal-actions"><button className="admin-btn admin-btn-outline" onClick={() => setEditing(null)}>Hủy</button><button className="admin-btn admin-btn-primary" onClick={() => void submit()}>Lưu</button></div></AdminModal>}
    </>
  );
};

export default NotificationManagementPage;
