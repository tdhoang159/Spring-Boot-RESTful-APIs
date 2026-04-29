
## BÁO CÁO TUẦN 6

**Tuần:** 6 (05/04/2026 – 11/04/2026)  
**Giai đoạn:** Backend + Auth  
**Ngày nộp:** 11/04/2026  

### 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|---|---|---|---|
| Trương Đức Hoàng | 2251012064 | Implement JWT Authentication & Authorization, Spring Security config, phân quyền theo Role, refresh token | `backend/auth-jwt-security` |
| Hoàng Mạnh Hùng | 2251012065 | Hoàn thiện Payment Service (tích hợp VNPay), generate QR Code (ZXing library), gửi e-ticket qua email | `backend/payment-qrcode-eticket` |
| Ngô Quốc Quân | 2251012118 | Implement QR check-in validation, Email Notification Service (JavaMailSender), batch email gửi thông báo | `backend/checkin-notification-service` |

### 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|---|---|---|
| Phân tích yêu cầu | Done | 100% |
| Thiết kế kiến trúc | Done | 100% |
| Backend API | Đang làm | 80% |
| Frontend UI | Chưa bắt đầu | 0% |
| Docker | Chưa bắt đầu | 0% |
| Testing | Chưa bắt đầu | 0% |

**Tổng tiến độ: ~55%**

### 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|---|---|
| Trương Đức Hoàng | Hoàn thiện Admin APIs còn lại (báo cáo toàn hệ thống, quản lý thông báo), viết API docs (Swagger) |
| Hoàng Mạnh Hùng | Fix bug Payment/QR, viết unit test cho Attendee service, bắt đầu React project setup & routing |
| Ngô Quốc Quân | Fix bug CheckIn/Notification, viết unit test cho Organizer service, setup Axios interceptor cho Frontend |

**Xác nhận của Nhóm trưởng:** Trương Đức Hoàng
