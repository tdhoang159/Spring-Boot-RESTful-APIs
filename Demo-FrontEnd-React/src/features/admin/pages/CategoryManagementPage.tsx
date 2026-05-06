import { useEffect, useState } from "react";
import { AdminBadge, AdminCard, AdminEmpty, AdminLoading, AdminModal, AdminPageHeader, AdminToast, SelectField, TextAreaField, TextField } from "../components/admin-ui";
import { categoryApi } from "../services/categoryApi";
import type { CategoryRecord, CategoryStatus } from "../types/admin.types";

const CategoryManagementPage = () => {
  const [items, setItems] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CategoryRecord | null>(null);
  const [form, setForm] = useState({ categoryName: "", description: "", status: "ACTIVE" as CategoryStatus });
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const load = () => categoryApi.getCategories().then(setItems).catch(() => setToast({ type: "error", message: "Không tải được categories" })).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const open = (category?: CategoryRecord) => {
    setEditing(category ?? { categoryId: 0, categoryName: "" });
    setForm(category ? { categoryName: category.categoryName, description: category.description ?? "", status: category.status ?? "ACTIVE" } : { categoryName: "", description: "", status: "ACTIVE" });
  };

  const submit = async () => {
    if (!form.categoryName.trim()) {
      setToast({ type: "error", message: "Tên category là bắt buộc" });
      return;
    }
    try {
      if (editing?.categoryId) await categoryApi.updateCategory(editing.categoryId, form);
      else await categoryApi.createCategory(form);
      setToast({ type: "success", message: "Lưu category thành công" });
      setEditing(null);
      setLoading(true);
      await load();
    } catch {
      setToast({ type: "error", message: "Không lưu được category" });
    }
  };

  const remove = async (category: CategoryRecord) => {
    if (!window.confirm(`Xóa category ${category.categoryName}?`)) return;
    try {
      await categoryApi.deleteCategory(category.categoryId);
      setItems((current) => current.filter((item) => item.categoryId !== category.categoryId));
      setToast({ type: "success", message: "Xóa category thành công" });
    } catch {
      setToast({ type: "error", message: "Không xóa được category" });
    }
  };

  return (
    <>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
      <AdminPageHeader title="Quản lý Categories" description="Quản lý danh mục sự kiện theo API /api/categories." action={<button className="admin-btn admin-btn-primary" onClick={() => open()}>Thêm category</button>} />
      <AdminCard>{loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="Chưa có category." /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Tên</th><th>Mô tả</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{items.map((item) => <tr key={item.categoryId}><td>{item.categoryName}</td><td>{item.description ?? "-"}</td><td><AdminBadge tone={item.status === "ACTIVE" ? "success" : "gray"}>{item.status ?? "ACTIVE"}</AdminBadge></td><td className="admin-actions"><button onClick={() => open(item)}>Sửa</button><button onClick={() => void remove(item)}>Xóa</button></td></tr>)}</tbody></table></div>}</AdminCard>
      {editing && <AdminModal title={editing.categoryId ? "Cập nhật category" : "Thêm category"} onClose={() => setEditing(null)}><div className="admin-form-grid"><TextField label="Tên category" value={form.categoryName} onChange={(categoryName) => setForm({ ...form, categoryName })} required /><SelectField label="Status" value={form.status} onChange={(status) => setForm({ ...form, status: status as CategoryStatus })} options={["ACTIVE", "INACTIVE"]} /><TextAreaField label="Mô tả" value={form.description} onChange={(description) => setForm({ ...form, description })} /></div><div className="admin-modal-actions"><button className="admin-btn admin-btn-outline" onClick={() => setEditing(null)}>Hủy</button><button className="admin-btn admin-btn-primary" onClick={() => void submit()}>Lưu</button></div></AdminModal>}
    </>
  );
};

export default CategoryManagementPage;
