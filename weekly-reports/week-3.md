**Tuần:** 3 (15/03/2026 – 21/03/2026)  
**Giai đoạn:** Thiết kế  
**Ngày nộp:** 21/03/2026  

### 1. Công việc đã hoàn thành

| Thành viên | MSSV | Công việc | Link Commit/PR |
|---|---|---|---|
| Trương Đức Hoàng | 2251012064 | Hoàn thiện full database design: ERD, schema SQL, tất cả bảng (Users, Events, Tickets, Orders, CheckIns, Categories, Notifications) | `docs/database-design-complete` |
| Hoàng Mạnh Hùng | 2251012065 | Thiết kế API endpoints cho module Attendee (search event, get detail, register ticket), hoàn thiện wireframe | `docs/api-design-attendee` |
| Ngô Quốc Quân | 2251012118 | Thiết kế API endpoints cho module Organizer (create event, manage ticket types, QR check-in, send email) | `docs/api-design-organizer` |

### 2. Tiến độ tổng thể

| Hạng mục | Trạng thái | % |
|---|---|---|
| Phân tích yêu cầu | Done | 100% |
| Thiết kế kiến trúc | Done | 100% |
| Backend API | Chưa bắt đầu | 0% |
| Frontend UI | Chưa bắt đầu | 0% |
| Docker | Chưa bắt đầu | 0% |
| Testing | Chưa bắt đầu | 0% |

**Tổng tiến độ: ~25%**

### 3. Kế hoạch tuần tới

| Thành viên | Công việc dự kiến |
|---|---|
| Trương Đức Hoàng | Setup Spring Boot project, cấu hình database (PostgreSQL), tạo entities và repositories cho User, Category, Event |
| Hoàng Mạnh Hùng | Tạo entities và repositories cho Ticket, Order, tích hợp Stripe/VNPay payment gateway (cơ bản) |
| Ngô Quốc Quân | Tạo entities và repositories cho CheckIn, Notification; setup cấu trúc service layer |

**Xác nhận của Nhóm trưởng:** Trương Đức Hoàng
