import { useEffect, useState } from "react";
import { AdminBadge, AdminCard, AdminEmpty, AdminLoading, AdminModal, AdminPageHeader, AdminToast, TextAreaField } from "../components/admin-ui";
import { eventApprovalApi } from "../services/eventApprovalApi";
import type { EventRecord } from "../types/admin.types";

const EventApprovalPage = () => {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<EventRecord | null>(null);
  const [rejecting, setRejecting] = useState<EventRecord | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const load = () => eventApprovalApi.getPendingEvents().then(setEvents).catch(() => setToast({ type: "error", message: "Không tải được sự kiện chờ duyệt" })).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);

  const approve = async (event: EventRecord) => {
    if (!window.confirm(`Duyệt sự kiện ${event.title}?`)) return;
    try {
      await eventApprovalApi.approveEvent(event);
      setEvents((current) => current.filter((item) => item.eventId !== event.eventId));
      setToast({ type: "success", message: "Đã duyệt sự kiện" });
    } catch {
      setToast({ type: "error", message: "Không duyệt được sự kiện. Kiểm tra payload update event ở backend." });
    }
  };

  const reject = async () => {
    if (!rejecting) return;
    if (!rejectReason.trim()) {
      setToast({ type: "error", message: "Vui lòng nhập lý do từ chối" });
      return;
    }
    try {
      await eventApprovalApi.rejectEvent(rejecting, rejectReason);
      setEvents((current) => current.filter((item) => item.eventId !== rejecting.eventId));
      setRejecting(null);
      setRejectReason("");
      setToast({ type: "success", message: "Đã từ chối sự kiện" });
    } catch {
      setToast({ type: "error", message: "Không từ chối được sự kiện. Cần endpoint backend lưu lý do reject." });
    }
  };

  return (
    <>
      {toast && <AdminToast {...toast} onClose={() => setToast(null)} />}
      <AdminPageHeader title="Duyệt sự kiện" description="Danh sách sự kiện PENDING, cho phép approve hoặc reject." />
      <AdminCard>{loading ? <AdminLoading /> : events.length === 0 ? <AdminEmpty message="Không có sự kiện đang chờ duyệt." /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Sự kiện</th><th>Organizer</th><th>Category</th><th>Ngày bắt đầu</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{events.map((event) => <tr key={event.eventId}><td>{event.title}</td><td>{event.organizer?.fullName ?? event.organizer?.name ?? "-"}</td><td>{event.category?.categoryName ?? "-"}</td><td>{event.startTime ? new Date(event.startTime).toLocaleString("vi-VN") : "-"}</td><td><AdminBadge tone="warning">{event.approvalStatus ?? "PENDING"}</AdminBadge></td><td className="admin-actions"><button onClick={() => setViewing(event)}>Chi tiết</button><button onClick={() => void approve(event)}>Approve</button><button onClick={() => setRejecting(event)}>Reject</button></td></tr>)}</tbody></table></div>}</AdminCard>
      {viewing && <AdminModal title="Chi tiết sự kiện" onClose={() => setViewing(null)}><div className="admin-detail-list"><p><b>Tiêu đề:</b> {viewing.title}</p><p><b>Slug:</b> {viewing.slug ?? "-"}</p><p><b>Địa điểm:</b> {[viewing.venueName, viewing.venueAddress, viewing.city].filter(Boolean).join(", ") || "-"}</p><p><b>Mô tả:</b> {viewing.description ?? viewing.shortDescription ?? "-"}</p><p><b>Publish:</b> {viewing.publishStatus ?? "-"}</p></div></AdminModal>}
      {rejecting && <AdminModal title="Lý do từ chối" onClose={() => setRejecting(null)}><TextAreaField label="Lý do" value={rejectReason} onChange={setRejectReason} required /><div className="admin-modal-actions"><button className="admin-btn admin-btn-outline" onClick={() => setRejecting(null)}>Hủy</button><button className="admin-btn admin-btn-danger" onClick={() => void reject()}>Reject</button></div></AdminModal>}
    </>
  );
};

export default EventApprovalPage;
