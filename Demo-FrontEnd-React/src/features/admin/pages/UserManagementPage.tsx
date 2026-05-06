import { useEffect, useMemo, useState } from "react";
import { AdminBadge, AdminCard, AdminEmpty, AdminLoading, AdminModal, AdminPageHeader, AdminToast, SelectField, TextField } from "../components/admin-ui";
import { ROLE_IDS, userApi } from "../services/userApi";
import type { UserPayload, UserRecord, UserRole, UserStatus } from "../types/admin.types";

const emptyForm = { fullName: "", email: "", phone: "", passwordHash: "", role: "ATTENDEE" as UserRole, status: "ACTIVE" as UserStatus };
const roleFromId = (roleId?: number): UserRole => roleId === 1 ? "ADMIN" : roleId === 2 ? "ORGANIZER" : "ATTENDEE";

const UserManagementPage = () => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [viewing, setViewing] = useState<UserRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadUsers = () => userApi.getUsers().then(setUsers).catch(() => setToast({ type: "error", message: "Không tải được danh sách user" })).finally(() => setLoading(false));

  useEffect(() => { void loadUsers(); }, []);

  const openForm = (user?: UserRecord) => {
    setEditing(user ?? { userId: 0, fullName: "", email: "" });
    setForm(user ? { fullName: user.fullName, email: user.email, phone: user.phone ?? "", passwordHash: "", role: user.roleName ?? roleFromId(user.roleId), status: user.status ?? "ACTIVE" } : emptyForm);
    setAvatarFile(null);
    setAvatarPreview(user?.avatarUrl ?? "");
  };

  const payload = useMemo<UserPayload>(() => ({ fullName: form.fullName, email: form.email, phone: form.phone, passwordHash: form.passwordHash || undefined, roleId: ROLE_IDS[form.role], status: form.status }), [form]);

  const submit = async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      setToast({ type: "error", message: "Tên và email là bắt buộc" });
      return;
    }
    try {
      if (editing?.userId) await userApi.updateUser(editing.userId, payload, avatarFile);
      else await userApi.createUser(payload, avatarFile);
      setToast({ type: "success", message: "Lưu user thành công" });
      setEditing(null);
      setLoading(true);
      await loadUsers();
    } catch {
      setToast({ type: "error", message: "Không lưu được user" });
    }
  };

  const handleAvatarChange = (file?: File) => {
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(editing?.avatarUrl ?? "");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setToast({ type: "error", message: "Avatar chỉ hỗ trợ jpg, jpeg, png, webp" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ type: "error", message: "Avatar tối đa 5MB" });
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const avatarSrc = (user: UserRecord) => user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email)}&background=465fff&color=fff`;

  const remove = async (user: UserRecord) => {
    if (!window.confirm(`Xóa user ${user.fullName}?`)) return;
    try {
      await userApi.deleteUser(user.userId);
      setToast({ type: "success", message: "Xóa user thành công" });
      setUsers((current) => current.filter((item) => item.userId !== user.userId));
    } catch {
      setToast({ type: "error", message: "Không xóa được user" });
    }
  };

  return (
    <>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
      <AdminPageHeader title="Quản lý User" description="CRUD user và phân quyền ADMIN, ORGANIZER, ATTENDEE." action={<button className="admin-btn admin-btn-primary" onClick={() => openForm()}>Thêm user</button>} />
      <AdminCard>
        {loading ? <AdminLoading /> : users.length === 0 ? <AdminEmpty message="Chưa có user." /> : (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Avatar</th><th>Tên</th><th>Email</th><th>Role</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
            {users.map((user) => <tr key={user.userId}><td><img className="admin-table-avatar" src={avatarSrc(user)} alt={user.fullName} /></td><td>{user.fullName}</td><td>{user.email}</td><td><AdminBadge tone="brand">{user.roleName ?? roleFromId(user.roleId)}</AdminBadge></td><td><AdminBadge tone={user.status === "ACTIVE" ? "success" : "gray"}>{user.status ?? "ACTIVE"}</AdminBadge></td><td className="admin-actions"><button onClick={() => setViewing(user)}>Xem</button><button onClick={() => openForm(user)}>Sửa</button><button onClick={() => void remove(user)}>Xóa</button></td></tr>)}
          </tbody></table></div>
        )}
      </AdminCard>
      {editing && <AdminModal title={editing.userId ? "Cập nhật user" : "Thêm user"} onClose={() => setEditing(null)}>
        <div className="admin-avatar-upload">
          <img src={avatarPreview || avatarSrc({ userId: 0, fullName: form.fullName || "User", email: form.email })} alt="Avatar preview" />
          <label className="admin-field">
            <span>Avatar</span>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => handleAvatarChange(event.target.files?.[0])} />
          </label>
        </div>
        <div className="admin-form-grid"><TextField label="Họ tên" value={form.fullName} onChange={(fullName) => setForm({ ...form, fullName })} required /><TextField label="Email" value={form.email} onChange={(email) => setForm({ ...form, email })} required type="email" /><TextField label="Số điện thoại" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} /><TextField label="Password hash" value={form.passwordHash} onChange={(passwordHash) => setForm({ ...form, passwordHash })} /><SelectField label="Role" value={form.role} onChange={(role) => setForm({ ...form, role: role as UserRole })} options={["ADMIN", "ORGANIZER", "ATTENDEE"]} /><SelectField label="Status" value={form.status} onChange={(status) => setForm({ ...form, status: status as UserStatus })} options={["ACTIVE", "INACTIVE", "SUSPENDED"]} /></div>
        <div className="admin-modal-actions"><button className="admin-btn admin-btn-outline" onClick={() => setEditing(null)}>Hủy</button><button className="admin-btn admin-btn-primary" onClick={() => void submit()}>Lưu</button></div>
      </AdminModal>}
      {viewing && <AdminModal title="Chi tiết user" onClose={() => setViewing(null)}><div className="admin-detail-list"><img className="admin-detail-avatar" src={avatarSrc(viewing)} alt={viewing.fullName} /><p><b>ID:</b> {viewing.userId}</p><p><b>Tên:</b> {viewing.fullName}</p><p><b>Email:</b> {viewing.email}</p><p><b>Phone:</b> {viewing.phone ?? "-"}</p><p><b>Role:</b> {viewing.roleName ?? roleFromId(viewing.roleId)}</p><p><b>Avatar URL:</b> {viewing.avatarUrl ?? "-"}</p></div></AdminModal>}
    </>
  );
};

export default UserManagementPage;
