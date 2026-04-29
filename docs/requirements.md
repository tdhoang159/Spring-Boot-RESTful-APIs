# Phân Tích & Thiết Kế Hệ Thống Quản Lý Sự Kiện

> **Đề tài 6 – Event Management System**  
> **Nhóm 1:** Trương Đức Hoàng · Hoàng Mạnh Hùng · Ngô Quốc Quân  
> **Công nghệ:** Spring Boot · React · PostgreSQL · Docker

---

## MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
   - 1.1 [Giới thiệu chung](#11-giới-thiệu-chung)
   - 1.2 [Chức năng chính theo từng Role](#12-chức-năng-chính-theo-từng-role)
2. [Phân tích thiết kế hệ thống](#2-phân-tích-thiết-kế-hệ-thống)
   - 2.1 [Role: Attendee (Người tham dự)](#21-role-attendee-người-tham-dự)
   - 2.2 [Role: Organizer (Nhà tổ chức)](#22-role-organizer-nhà-tổ-chức)
   - 2.3 [Role: Admin (Quản trị viên)](#23-role-admin-quản-trị-viên)

---

## 1. Tổng quan hệ thống

### 1.1 Giới thiệu chung

Hệ thống Quản lý Sự kiện (Event Management System) là một nền tảng web cho phép tổ chức, quản lý và tham gia các sự kiện trực tuyến một cách toàn diện. Hệ thống phục vụ ba nhóm người dùng chính với các quyền hạn và chức năng khác nhau: **Attendee** (người tham dự), **Organizer** (nhà tổ chức) và **Admin** (quản trị viên hệ thống).

Hệ thống hỗ trợ toàn bộ vòng đời của một sự kiện — từ lúc Organizer tạo và công bố sự kiện, Attendee tìm kiếm và mua vé, đến khi check-in thực tế bằng QR Code và Admin theo dõi toàn bộ hoạt động qua báo cáo thống kê.

### 1.2 Chức năng chính theo từng Role

#### Role 1 – Attendee (Người tham dự)

Attendee là người dùng cuối, sử dụng hệ thống để tìm kiếm và tham gia sự kiện.

| STT | Chức năng | Mô tả |
|-----|-----------|-------|
| 1 | Tìm kiếm sự kiện | Tìm kiếm sự kiện theo từ khóa, danh mục, địa điểm, ngày tổ chức |
| 2 | Xem chi tiết sự kiện | Xem thông tin đầy đủ: mô tả, lịch trình, bản đồ, thông tin Organizer |
| 3 | Mua vé & thanh toán online | Chọn loại vé, điền thông tin, thanh toán qua cổng VNPay/Stripe |
| 4 | Nhận e-ticket (QR Code) | Nhận vé điện tử kèm mã QR qua email sau khi thanh toán thành công |
| 5 |Xem lịch sự kiện đã đăng ký | Xem danh sách các sự kiện đã mua vé, trạng thái vé  |


#### Role 2 – Organizer (Nhà tổ chức)

Organizer là đối tác tổ chức sự kiện, được Admin cấp quyền tạo và quản lý sự kiện trên nền tảng.

| STT | Chức năng | Mô tả |
|-----|-----------|-------|
| 1 | Tạo sự kiện & quản lý vé | Tạo sự kiện mới, cấu hình nhiều loại vé với giá và số lượng khác nhau |
| 2 | Publish / Unpublish sự kiện | Công bố hoặc tạm ẩn sự kiện sau khi được Admin duyệt |
| 3 | Xem danh sách đăng ký | Xem danh sách Attendee đã mua vé cho từng sự kiện |
| 4 | Check-in người tham dự (QR) | Quét mã QR để xác nhận Attendee check-in tại sự kiện |
| 5 | Gửi email thông báo | Gửi email hàng loạt đến tất cả Attendee đã đăng ký |
| 6 | Báo cáo bán vé theo loại | Thống kê doanh thu, số vé đã bán/còn lại theo từng loại vé |

#### Role 3 – Admin (Quản trị viên)

Admin là người quản trị toàn bộ hệ thống, có quyền cao nhất.

| STT | Chức năng | Mô tả |
|-----|-----------|-------|
| 1 | Duyệt sự kiện mới | Xem xét và phê duyệt/từ chối sự kiện do Organizer tạo |
| 2 | Quản lý Organizer (CRUD) | Cấp phép, chỉnh sửa thông tin, khoá tài khoản Organizer |
| 3 | Quản lý Categories | Tạo, sửa, xoá danh mục sự kiện (âm nhạc, thể thao, công nghệ…) |
| 4 | Cấu hình commission | Thiết lập tỷ lệ hoa hồng hệ thống thu trên mỗi giao dịch vé |
| 5 | Báo cáo toàn hệ thống | Xem thống kê tổng thể: doanh thu, người dùng, sự kiện theo thời gian |
| 6 | Quản lý thông báo hệ thống | Tạo và gửi thông báo hệ thống đến tất cả người dùng |

---

## 2. Phân tích thiết kế hệ thống

---

## 2.1 Role: Attendee (Người tham dự)

### Use Case Diagram – Attendee

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Use Case Diagram – Attendee              -->
<!-- Gợi ý: Vẽ bằng PlantUML / draw.io rồi export PNG/SVG        -->
<!-- Tên file gợi ý: usecase-attendee.png                         -->
<!--                                                              -->
<!-- Nội dung sơ đồ cần thể hiện:                                 -->
<!--   Actor: Attendee                                            -->
<!--   UC1: Tìm kiếm sự kiện                                     -->
<!--   UC2: Xem chi tiết sự kiện                                  -->
<!--   UC3: Mua vé & thanh toán online                           -->
<!--   UC4: Nhận e-ticket (QR Code)  ← «include» từ UC3          -->
<!--   UC5: Check-in bằng QR Code                                -->
<!--   UC6: Xem lịch sự kiện đã đăng ký                          -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: usecase-attendee.png ]
```

> ⚠️ **Chỗ nhúng hình:** Use Case Diagram – Attendee  
> `![Use Case Diagram – Attendee](./diagrams/usecase-attendee.png)`

---

### UC1 – Tìm kiếm sự kiện

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ATT-01 |
| **Tên** | Tìm kiếm sự kiện |
| **Actor** | Attendee |
| **Mô tả** | Attendee nhập từ khóa hoặc sử dụng bộ lọc để tìm kiếm sự kiện phù hợp |
| **Tiền điều kiện** | Attendee đã đăng nhập hoặc chưa đăng nhập (tìm kiếm công khai) |
| **Hậu điều kiện** | Hệ thống hiển thị danh sách sự kiện phù hợp với tiêu chí tìm kiếm |
| **Luồng chính** | 1. Attendee truy cập trang chủ hoặc trang tìm kiếm<br>2. Nhập từ khóa tên sự kiện vào ô tìm kiếm<br>3. Áp dụng bộ lọc (danh mục, địa điểm, ngày, khoảng giá)<br>4. Hệ thống trả về danh sách sự kiện phù hợp<br>5. Attendee xem kết quả dạng danh sách hoặc lưới |
| **Luồng thay thế** | 3a. Không có kết quả → Hệ thống gợi ý sự kiện phổ biến<br>4a. Lỗi kết nối → Hiển thị thông báo lỗi |
| **Ngoại lệ** | Từ khóa không hợp lệ → Hiển thị thông báo yêu cầu nhập lại |

#### Activity Diagram – UC1: Tìm kiếm sự kiện

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Tìm kiếm sự kiện     -->
<!-- Tên file gợi ý: activity-att-01-search.png                   -->
<!-- ============================================================ -->



![AD Tìm kiếm sự kiện](./screenshots/AD_Tìm kiếm sự kiện.png)

#### Sequence Diagram – UC1: Tìm kiếm sự kiện

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Tìm kiếm sự kiện     -->
<!-- Tên file gợi ý: sequence-att-01-search.png                   -->
<!-- Các đối tượng tham gia:                                      -->
<!--   Attendee → SearchPage → EventController → EventService     -->
<!--   → EventRepository → Database                              -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-att-01-search.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC1 Tìm kiếm sự kiện  
> `![Sequence Diagram – Tìm kiếm sự kiện](./diagrams/sequence-att-01-search.png)`

---

### UC2 – Xem chi tiết sự kiện

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ATT-02 |
| **Tên** | Xem chi tiết sự kiện |
| **Actor** | Attendee |
| **Mô tả** | Attendee xem thông tin chi tiết đầy đủ của một sự kiện |
| **Tiền điều kiện** | Sự kiện đang ở trạng thái Published; Attendee đã thực hiện UC-ATT-01 |
| **Hậu điều kiện** | Attendee có đủ thông tin để quyết định mua vé |
| **Luồng chính** | 1. Attendee nhấp vào một sự kiện trong danh sách kết quả<br>2. Hệ thống tải trang chi tiết sự kiện<br>3. Hiển thị: tên, mô tả, hình ảnh, ngày giờ, địa điểm (bản đồ), Organizer, loại vé và giá<br>4. Attendee xem thông tin và các loại vé còn chỗ |
| **Luồng thay thế** | 2a. Sự kiện đã hết vé → Hiển thị "Hết vé", ẩn nút mua vé |
| **Ngoại lệ** | Sự kiện bị xóa hoặc ẩn → Chuyển về trang tìm kiếm với thông báo |

#### Activity Diagram – UC2: Xem chi tiết sự kiện

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Xem chi tiết sự kiện  -->
<!-- Tên file gợi ý: activity-att-02-detail.png                   -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-att-02-detail.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC2 Xem chi tiết sự kiện  
> `![Activity Diagram – Xem chi tiết sự kiện](./diagrams/activity-att-02-detail.png)`

#### Sequence Diagram – UC2: Xem chi tiết sự kiện

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Xem chi tiết sự kiện  -->
<!-- Tên file gợi ý: sequence-att-02-detail.png                   -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-att-02-detail.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC2 Xem chi tiết sự kiện  
> `![Sequence Diagram – Xem chi tiết sự kiện](./diagrams/sequence-att-02-detail.png)`

---

### UC3 – Mua vé & thanh toán online

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ATT-03 |
| **Tên** | Mua vé & thanh toán online |
| **Actor** | Attendee |
| **Mô tả** | Attendee chọn loại vé, điền thông tin và hoàn tất thanh toán qua cổng thanh toán |
| **Tiền điều kiện** | Attendee đã đăng nhập; sự kiện còn vé |
| **Hậu điều kiện** | Đơn hàng được tạo; thanh toán thành công; kích hoạt UC-ATT-04 (nhận e-ticket) |
| **Luồng chính** | 1. Attendee chọn loại vé và số lượng<br>2. Nhấn "Mua vé" → Hệ thống tạo đơn hàng tạm<br>3. Attendee điền thông tin người tham dự<br>4. Chọn phương thức thanh toán (VNPay/Stripe)<br>5. Hệ thống chuyển đến cổng thanh toán<br>6. Attendee hoàn tất thanh toán<br>7. Cổng thanh toán callback về hệ thống<br>8. Hệ thống xác nhận, cập nhật trạng thái đơn hàng → PAID<br>9. Tự động gửi e-ticket qua email (include UC-ATT-04) |
| **Luồng thay thế** | 6a. Thanh toán thất bại → Huỷ đơn tạm, thông báo lỗi<br>8a. Callback timeout → Hệ thống kiểm tra lại sau 5 phút |
| **Ngoại lệ** | Vé hết trong lúc thanh toán → Hoàn tiền, thông báo Attendee |

#### Activity Diagram – UC3: Mua vé & thanh toán

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Mua vé & thanh toán   -->
<!-- Tên file gợi ý: activity-att-03-payment.png                  -->
<!-- Lưu ý: Sơ đồ cần thể hiện swimlane Attendee / System /       -->
<!--        Payment Gateway                                       -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-att-03-payment.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC3 Mua vé & thanh toán  
> `![Activity Diagram – Mua vé & thanh toán](./diagrams/activity-att-03-payment.png)`

#### Sequence Diagram – UC3: Mua vé & thanh toán

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Mua vé & thanh toán   -->
<!-- Tên file gợi ý: sequence-att-03-payment.png                  -->
<!-- Các đối tượng: Attendee → OrderController → OrderService     -->
<!--   → PaymentService → VNPayGateway → (callback)              -->
<!--   → OrderService → EmailService → Attendee                  -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-att-03-payment.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC3 Mua vé & thanh toán  
> `![Sequence Diagram – Mua vé & thanh toán](./diagrams/sequence-att-03-payment.png)`

---

### UC4 – Nhận e-ticket (QR Code)

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ATT-04 |
| **Tên** | Nhận e-ticket (QR Code) |
| **Actor** | Attendee (System tự động) |
| **Mô tả** | Sau thanh toán thành công, hệ thống tự động tạo mã QR và gửi e-ticket qua email |
| **Tiền điều kiện** | UC-ATT-03 hoàn tất thành công; trạng thái Order = PAID |
| **Hậu điều kiện** | Attendee nhận được email chứa e-ticket PDF với mã QR duy nhất |
| **Luồng chính** | 1. Hệ thống nhận sự kiện thanh toán thành công<br>2. Tạo mã QR duy nhất cho từng vé (chứa ticketId + hash)<br>3. Tạo file PDF e-ticket từ template<br>4. Gửi email đính kèm e-ticket đến Attendee<br>5. Cập nhật trạng thái Ticket = ISSUED |
| **Luồng thay thế** | 4a. Gửi email thất bại → Retry 3 lần, lưu vào queue |
| **Ngoại lệ** | Lỗi tạo QR → Log lỗi, thông báo admin |

#### Activity Diagram – UC4: Nhận e-ticket

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Nhận e-ticket         -->
<!-- Tên file gợi ý: activity-att-04-eticket.png                  -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-att-04-eticket.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC4 Nhận e-ticket  
> `![Activity Diagram – Nhận e-ticket](./diagrams/activity-att-04-eticket.png)`

#### Sequence Diagram – UC4: Nhận e-ticket

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Nhận e-ticket         -->
<!-- Tên file gợi ý: sequence-att-04-eticket.png                  -->
<!-- Các đối tượng: OrderService → TicketService → QRCodeService  -->
<!--   → PDFService → EmailService → Attendee (Email)            -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-att-04-eticket.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC4 Nhận e-ticket  
> `![Sequence Diagram – Nhận e-ticket](./diagrams/sequence-att-04-eticket.png)`

---

### UC5 – Check-in bằng QR Code

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ATT-05 |
| **Tên** | Check-in bằng QR Code |
| **Actor** | Attendee |
| **Mô tả** | Attendee xuất trình mã QR trên thiết bị để được Organizer quét xác nhận vào sự kiện |
| **Tiền điều kiện** | Attendee có e-ticket hợp lệ; đang trong thời gian check-in của sự kiện |
| **Hậu điều kiện** | Trạng thái vé chuyển thành CHECKED_IN; check-in record được ghi lại |
| **Luồng chính** | 1. Attendee mở e-ticket trên email/ứng dụng, hiển thị mã QR<br>2. Organizer dùng thiết bị quét QR (UC-ORG-04)<br>3. Hệ thống xác thực mã QR, kiểm tra tính hợp lệ<br>4. Trả về kết quả hợp lệ → Attendee được vào sự kiện<br>5. Ghi log check-in (thời gian, thiết bị) |
| **Luồng thay thế** | 3a. QR đã được quét trước đó → Báo "Vé đã sử dụng" |
| **Ngoại lệ** | QR không hợp lệ / hết hạn → Báo lỗi, từ chối vào |

#### Activity Diagram – UC5: Check-in bằng QR

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Check-in bằng QR      -->
<!-- Tên file gợi ý: activity-att-05-checkin.png                  -->
<!-- Swimlane: Attendee / Organizer / System                      -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-att-05-checkin.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC5 Check-in bằng QR  
> `![Activity Diagram – Check-in bằng QR](./diagrams/activity-att-05-checkin.png)`

#### Sequence Diagram – UC5: Check-in bằng QR

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Check-in bằng QR      -->
<!-- Tên file gợi ý: sequence-att-05-checkin.png                  -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-att-05-checkin.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC5 Check-in bằng QR  
> `![Sequence Diagram – Check-in bằng QR](./diagrams/sequence-att-05-checkin.png)`

---

### UC6 – Xem lịch sự kiện đã đăng ký

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ATT-06 |
| **Tên** | Xem lịch sự kiện đã đăng ký |
| **Actor** | Attendee |
| **Mô tả** | Attendee xem danh sách tất cả sự kiện đã mua vé, trạng thái vé và thông tin chi tiết |
| **Tiền điều kiện** | Attendee đã đăng nhập; có ít nhất một đơn hàng thành công |
| **Hậu điều kiện** | Attendee xem được lịch sử và vé hiện tại |
| **Luồng chính** | 1. Attendee truy cập trang "Vé của tôi" hoặc "My Events"<br>2. Hệ thống lấy danh sách đơn hàng đã thanh toán của Attendee<br>3. Hiển thị danh sách theo thời gian (sắp tới / đã qua)<br>4. Attendee nhấn vào từng vé để xem QR hoặc tải lại e-ticket |
| **Luồng thay thế** | 2a. Chưa có vé nào → Gợi ý tìm kiếm sự kiện |
| **Ngoại lệ** | Phiên đăng nhập hết hạn → Yêu cầu đăng nhập lại |

#### Activity Diagram – UC6: Xem lịch sự kiện đã đăng ký

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Xem lịch sự kiện      -->
<!-- Tên file gợi ý: activity-att-06-myevents.png                 -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-att-06-myevents.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC6 Xem lịch sự kiện đã đăng ký  
> `![Activity Diagram – Xem lịch sự kiện](./diagrams/activity-att-06-myevents.png)`

#### Sequence Diagram – UC6: Xem lịch sự kiện đã đăng ký

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Xem lịch sự kiện      -->
<!-- Tên file gợi ý: sequence-att-06-myevents.png                 -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-att-06-myevents.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC6 Xem lịch sự kiện đã đăng ký  
> `![Sequence Diagram – Xem lịch sự kiện](./diagrams/sequence-att-06-myevents.png)`

---

## 2.2 Role: Organizer (Nhà tổ chức)

### Use Case Diagram – Organizer

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Use Case Diagram – Organizer             -->
<!-- Tên file gợi ý: usecase-organizer.png                        -->
<!--                                                              -->
<!-- Nội dung sơ đồ cần thể hiện:                                 -->
<!--   Actor: Organizer                                           -->
<!--   UC1: Tạo sự kiện & quản lý vé                             -->
<!--   UC2: Publish / Unpublish sự kiện                          -->
<!--   UC3: Xem danh sách đăng ký                                 -->
<!--   UC4: Check-in người tham dự (QR)                          -->
<!--   UC5: Gửi email thông báo                                   -->
<!--   UC6: Báo cáo bán vé theo loại                             -->
<!--   Dependency: UC1 «include» UC2 (phải có sự kiện mới publish)-->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: usecase-organizer.png ]
```

> ⚠️ **Chỗ nhúng hình:** Use Case Diagram – Organizer  
> `![Use Case Diagram – Organizer](./diagrams/usecase-organizer.png)`

---

### UC1 – Tạo sự kiện & quản lý vé

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ORG-01 |
| **Tên** | Tạo sự kiện & quản lý vé |
| **Actor** | Organizer |
| **Mô tả** | Organizer tạo mới một sự kiện với đầy đủ thông tin và cấu hình nhiều loại vé |
| **Tiền điều kiện** | Organizer đã đăng nhập; tài khoản được Admin phê duyệt |
| **Hậu điều kiện** | Sự kiện được lưu ở trạng thái DRAFT, chờ Admin duyệt |
| **Luồng chính** | 1. Organizer truy cập trang "Tạo sự kiện mới"<br>2. Điền thông tin sự kiện: tên, mô tả, danh mục, địa điểm, ngày giờ, banner<br>3. Thêm các loại vé: tên vé, giá, số lượng, ngày bán<br>4. Nhấn "Lưu nháp" hoặc "Gửi duyệt"<br>5. Hệ thống lưu sự kiện với status PENDING_APPROVAL<br>6. Gửi thông báo đến Admin để duyệt |
| **Luồng thay thế** | 4a. Lưu nháp → Sự kiện status = DRAFT, chưa gửi duyệt |
| **Ngoại lệ** | Thiếu thông tin bắt buộc → Hiển thị lỗi validation |

#### Activity Diagram – UC1: Tạo sự kiện & quản lý vé

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Tạo sự kiện           -->
<!-- Tên file gợi ý: activity-org-01-create-event.png             -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-org-01-create-event.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC1 Tạo sự kiện & quản lý vé  
> `![Activity Diagram – Tạo sự kiện](./diagrams/activity-org-01-create-event.png)`

#### Sequence Diagram – UC1: Tạo sự kiện & quản lý vé

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Tạo sự kiện           -->
<!-- Tên file gợi ý: sequence-org-01-create-event.png             -->
<!-- Các đối tượng: Organizer → EventForm → EventController       -->
<!--   → EventService → EventRepository → NotificationService    -->
<!--   → Admin (Email)                                           -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-org-01-create-event.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC1 Tạo sự kiện & quản lý vé  
> `![Sequence Diagram – Tạo sự kiện](./diagrams/sequence-org-01-create-event.png)`

---

### UC2 – Publish / Unpublish sự kiện

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ORG-02 |
| **Tên** | Publish / Unpublish sự kiện |
| **Actor** | Organizer |
| **Mô tả** | Organizer công bố sự kiện đã được duyệt để Attendee có thể tìm thấy và mua vé, hoặc ẩn sự kiện tạm thời |
| **Tiền điều kiện** | Sự kiện đã được Admin duyệt (status = APPROVED) |
| **Hậu điều kiện** | Sự kiện hiển thị/ẩn trên trang tìm kiếm công khai |
| **Luồng chính** | 1. Organizer vào trang quản lý sự kiện của mình<br>2. Chọn sự kiện đã được duyệt<br>3. Nhấn "Publish" → Hệ thống cập nhật status = PUBLISHED<br>4. Sự kiện xuất hiện trên trang tìm kiếm |
| **Luồng thay thế** | 3a. Nhấn "Unpublish" → status = UNPUBLISHED, ẩn khỏi tìm kiếm |
| **Ngoại lệ** | Sự kiện chưa được duyệt → Nút Publish bị vô hiệu hoá |

#### Activity Diagram – UC2: Publish / Unpublish

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Publish/Unpublish      -->
<!-- Tên file gợi ý: activity-org-02-publish.png                  -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-org-02-publish.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC2 Publish / Unpublish  
> `![Activity Diagram – Publish/Unpublish](./diagrams/activity-org-02-publish.png)`

#### Sequence Diagram – UC2: Publish / Unpublish

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Publish/Unpublish      -->
<!-- Tên file gợi ý: sequence-org-02-publish.png                  -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-org-02-publish.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC2 Publish / Unpublish  
> `![Sequence Diagram – Publish/Unpublish](./diagrams/sequence-org-02-publish.png)`

---

### UC3 – Xem danh sách đăng ký

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ORG-03 |
| **Tên** | Xem danh sách đăng ký |
| **Actor** | Organizer |
| **Mô tả** | Organizer xem toàn bộ danh sách Attendee đã mua vé cho sự kiện của mình |
| **Tiền điều kiện** | Organizer đã đăng nhập; có ít nhất một sự kiện đã Published |
| **Hậu điều kiện** | Organizer nắm được số lượng và thông tin người tham dự |
| **Luồng chính** | 1. Organizer chọn sự kiện trong dashboard<br>2. Truy cập tab "Danh sách đăng ký"<br>3. Hệ thống hiển thị bảng: tên Attendee, email, loại vé, trạng thái thanh toán, trạng thái check-in<br>4. Organizer có thể tìm kiếm, lọc, xuất file CSV |
| **Luồng thay thế** | 4a. Xuất CSV → Hệ thống tạo và tải xuống file |
| **Ngoại lệ** | Chưa có ai đăng ký → Hiển thị "Chưa có đăng ký" |

#### Activity Diagram – UC3: Xem danh sách đăng ký

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Xem danh sách đăng ký -->
<!-- Tên file gợi ý: activity-org-03-registrations.png            -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-org-03-registrations.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC3 Xem danh sách đăng ký  
> `![Activity Diagram – Xem danh sách đăng ký](./diagrams/activity-org-03-registrations.png)`

#### Sequence Diagram – UC3: Xem danh sách đăng ký

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Xem danh sách đăng ký -->
<!-- Tên file gợi ý: sequence-org-03-registrations.png            -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-org-03-registrations.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC3 Xem danh sách đăng ký  
> `![Sequence Diagram – Xem danh sách đăng ký](./diagrams/sequence-org-03-registrations.png)`

---

### UC4 – Check-in người tham dự (QR)

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ORG-04 |
| **Tên** | Check-in người tham dự (QR) |
| **Actor** | Organizer |
| **Mô tả** | Organizer sử dụng thiết bị quét mã QR của Attendee để xác nhận vào sự kiện |
| **Tiền điều kiện** | Sự kiện đang diễn ra hoặc trong thời gian check-in; Organizer đăng nhập trên thiết bị di động |
| **Hậu điều kiện** | Vé Attendee được đánh dấu CHECKED_IN; không thể quét lại |
| **Luồng chính** | 1. Organizer mở màn hình Check-in Scanner<br>2. Camera kích hoạt, Organizer hướng vào mã QR của Attendee<br>3. Hệ thống decode QR, gửi request xác thực<br>4. Server kiểm tra: ticketId hợp lệ, đúng sự kiện, chưa check-in<br>5. Trả về kết quả hợp lệ → Hiển thị thông tin Attendee (tên, loại vé)<br>6. Cập nhật trạng thái vé = CHECKED_IN |
| **Luồng thay thế** | 4a. Vé đã check-in → Cảnh báo "Vé đã sử dụng"<br>4b. Vé của sự kiện khác → Cảnh báo "Vé không hợp lệ" |
| **Ngoại lệ** | Mất kết nối mạng → Hỗ trợ offline mode, đồng bộ khi có mạng |

#### Activity Diagram – UC4: Check-in người tham dự

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Check-in người tham dự -->
<!-- Tên file gợi ý: activity-org-04-checkin-scanner.png          -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-org-04-checkin-scanner.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC4 Check-in người tham dự  
> `![Activity Diagram – Check-in người tham dự](./diagrams/activity-org-04-checkin-scanner.png)`

#### Sequence Diagram – UC4: Check-in người tham dự

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Check-in người tham dự -->
<!-- Tên file gợi ý: sequence-org-04-checkin-scanner.png          -->
<!-- Các đối tượng: Organizer → ScannerUI → CheckInController     -->
<!--   → CheckInService → TicketRepository → CheckInRepository   -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-org-04-checkin-scanner.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC4 Check-in người tham dự  
> `![Sequence Diagram – Check-in người tham dự](./diagrams/sequence-org-04-checkin-scanner.png)`

---

### UC5 – Gửi email thông báo

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ORG-05 |
| **Tên** | Gửi email thông báo |
| **Actor** | Organizer |
| **Mô tả** | Organizer soạn và gửi email thông báo hàng loạt đến tất cả Attendee đã đăng ký sự kiện |
| **Tiền điều kiện** | Organizer đã đăng nhập; có ít nhất một Attendee đã đăng ký |
| **Hậu điều kiện** | Email được gửi đến toàn bộ Attendee; log ghi nhận kết quả gửi |
| **Luồng chính** | 1. Organizer vào trang quản lý sự kiện → tab "Thông báo"<br>2. Soạn tiêu đề và nội dung email<br>3. Xem trước preview email<br>4. Nhấn "Gửi tất cả"<br>5. Hệ thống đưa vào hàng đợi email (queue)<br>6. Worker xử lý gửi từng email<br>7. Cập nhật trạng thái gửi (success/fail) |
| **Luồng thay thế** | 6a. Gửi thất bại một số địa chỉ → Retry, log lỗi |
| **Ngoại lệ** | Nội dung trống → Yêu cầu nhập đủ thông tin |

#### Activity Diagram – UC5: Gửi email thông báo

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Gửi email thông báo   -->
<!-- Tên file gợi ý: activity-org-05-send-email.png               -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-org-05-send-email.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC5 Gửi email thông báo  
> `![Activity Diagram – Gửi email thông báo](./diagrams/activity-org-05-send-email.png)`

#### Sequence Diagram – UC5: Gửi email thông báo

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Gửi email thông báo   -->
<!-- Tên file gợi ý: sequence-org-05-send-email.png               -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-org-05-send-email.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC5 Gửi email thông báo  
> `![Sequence Diagram – Gửi email thông báo](./diagrams/sequence-org-05-send-email.png)`

---

### UC6 – Báo cáo bán vé theo loại

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ORG-06 |
| **Tên** | Báo cáo bán vé theo loại |
| **Actor** | Organizer |
| **Mô tả** | Organizer xem thống kê chi tiết số vé đã bán, doanh thu và tỷ lệ lấp đầy theo từng loại vé |
| **Tiền điều kiện** | Sự kiện đã có ít nhất một giao dịch bán vé |
| **Hậu điều kiện** | Organizer nắm được tình hình bán vé để ra quyết định |
| **Luồng chính** | 1. Organizer vào trang chi tiết sự kiện → tab "Báo cáo"<br>2. Hệ thống tổng hợp dữ liệu: số vé bán được / tổng, doanh thu, % lấp đầy theo loại vé<br>3. Hiển thị bảng và biểu đồ<br>4. Organizer có thể lọc theo khoảng thời gian, xuất PDF/CSV |
| **Luồng thay thế** | 4a. Xuất báo cáo → Tạo file PDF hoặc CSV |
| **Ngoại lệ** | Không có dữ liệu → Hiển thị biểu đồ trống |

#### Activity Diagram – UC6: Báo cáo bán vé

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Báo cáo bán vé        -->
<!-- Tên file gợi ý: activity-org-06-report.png                   -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-org-06-report.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC6 Báo cáo bán vé  
> `![Activity Diagram – Báo cáo bán vé](./diagrams/activity-org-06-report.png)`

#### Sequence Diagram – UC6: Báo cáo bán vé

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Báo cáo bán vé        -->
<!-- Tên file gợi ý: sequence-org-06-report.png                   -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-org-06-report.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC6 Báo cáo bán vé  
> `![Sequence Diagram – Báo cáo bán vé](./diagrams/sequence-org-06-report.png)`

---

## 2.3 Role: Admin (Quản trị viên)

### Use Case Diagram – Admin

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Use Case Diagram – Admin                 -->
<!-- Tên file gợi ý: usecase-admin.png                            -->
<!--                                                              -->
<!-- Nội dung sơ đồ cần thể hiện:                                 -->
<!--   Actor: Admin                                               -->
<!--   UC1: Duyệt sự kiện mới                                    -->
<!--   UC2: Quản lý Organizer (CRUD)                             -->
<!--   UC3: Quản lý Categories                                    -->
<!--   UC4: Cấu hình commission                                   -->
<!--   UC5: Báo cáo toàn hệ thống                                 -->
<!--   UC6: Quản lý thông báo hệ thống                           -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: usecase-admin.png ]
```

> ⚠️ **Chỗ nhúng hình:** Use Case Diagram – Admin  
> `![Use Case Diagram – Admin](./diagrams/usecase-admin.png)`

---

### UC1 – Duyệt sự kiện mới

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ADM-01 |
| **Tên** | Duyệt sự kiện mới |
| **Actor** | Admin |
| **Mô tả** | Admin xem xét thông tin sự kiện do Organizer gửi lên và phê duyệt hoặc từ chối |
| **Tiền điều kiện** | Có sự kiện ở trạng thái PENDING_APPROVAL |
| **Hậu điều kiện** | Sự kiện chuyển sang APPROVED hoặc REJECTED; Organizer nhận thông báo |
| **Luồng chính** | 1. Admin nhận thông báo có sự kiện chờ duyệt<br>2. Truy cập trang quản lý sự kiện → bộ lọc "Chờ duyệt"<br>3. Xem thông tin chi tiết sự kiện<br>4. Nhấn "Duyệt" → Cập nhật status = APPROVED<br>5. Hệ thống gửi email thông báo đến Organizer |
| **Luồng thay thế** | 4a. Nhấn "Từ chối" + ghi lý do → status = REJECTED; email thông báo lý do từ chối |
| **Ngoại lệ** | Admin không có quyền duyệt sự kiện của chính mình |

#### Activity Diagram – UC1: Duyệt sự kiện

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Duyệt sự kiện         -->
<!-- Tên file gợi ý: activity-adm-01-approve-event.png            -->
<!-- Swimlane: Admin / System / Organizer                         -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-adm-01-approve-event.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC1 Duyệt sự kiện  
> `![Activity Diagram – Duyệt sự kiện](./diagrams/activity-adm-01-approve-event.png)`

#### Sequence Diagram – UC1: Duyệt sự kiện

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Duyệt sự kiện         -->
<!-- Tên file gợi ý: sequence-adm-01-approve-event.png            -->
<!-- Các đối tượng: Admin → AdminPanel → EventController          -->
<!--   → EventService → EventRepository → NotificationService    -->
<!--   → Organizer (Email)                                       -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-adm-01-approve-event.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC1 Duyệt sự kiện  
> `![Sequence Diagram – Duyệt sự kiện](./diagrams/sequence-adm-01-approve-event.png)`

---

### UC2 – Quản lý Organizer (CRUD)

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ADM-02 |
| **Tên** | Quản lý Organizer (CRUD) |
| **Actor** | Admin |
| **Mô tả** | Admin thực hiện đầy đủ thao tác tạo, xem, sửa, khoá/xoá tài khoản Organizer |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | Thông tin Organizer được cập nhật theo yêu cầu |
| **Luồng chính** | 1. Admin truy cập trang "Quản lý Organizer"<br>2. Xem danh sách Organizer với trạng thái tài khoản<br>3. Chọn hành động: Tạo mới / Sửa thông tin / Khoá tài khoản / Xoá<br>4. Hệ thống xác nhận và thực hiện thao tác<br>5. Gửi email thông báo đến Organizer nếu bị khoá hoặc xoá |
| **Luồng thay thế** | 3a. Khoá tài khoản → Organizer không thể đăng nhập, sự kiện bị ẩn |
| **Ngoại lệ** | Xoá Organizer có sự kiện đang active → Yêu cầu huỷ sự kiện trước |

#### Activity Diagram – UC2: Quản lý Organizer

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Quản lý Organizer     -->
<!-- Tên file gợi ý: activity-adm-02-manage-organizer.png         -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-adm-02-manage-organizer.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC2 Quản lý Organizer  
> `![Activity Diagram – Quản lý Organizer](./diagrams/activity-adm-02-manage-organizer.png)`

#### Sequence Diagram – UC2: Quản lý Organizer

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Quản lý Organizer     -->
<!-- Tên file gợi ý: sequence-adm-02-manage-organizer.png         -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-adm-02-manage-organizer.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC2 Quản lý Organizer  
> `![Sequence Diagram – Quản lý Organizer](./diagrams/sequence-adm-02-manage-organizer.png)`

---

### UC3 – Quản lý Categories

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ADM-03 |
| **Tên** | Quản lý categories |
| **Actor** | Admin |
| **Mô tả** | Admin tạo, sửa, xoá các danh mục sự kiện được dùng để phân loại trên toàn hệ thống |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | Danh mục được cập nhật; Organizer thấy danh mục mới khi tạo sự kiện |
| **Luồng chính** | 1. Admin vào trang "Quản lý Categories"<br>2. Xem danh sách categories hiện có<br>3. Tạo mới: nhập tên, icon, mô tả → Lưu<br>4. Sửa: chỉnh sửa thông tin → Cập nhật<br>5. Xoá: xác nhận xoá (chỉ được xoá category không có sự kiện) |
| **Luồng thay thế** | 5a. Category đang được dùng → Không cho xoá, gợi ý ẩn |
| **Ngoại lệ** | Tên category trùng → Báo lỗi trùng lặp |

#### Activity Diagram – UC3: Quản lý Categories

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Quản lý Categories    -->
<!-- Tên file gợi ý: activity-adm-03-categories.png               -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-adm-03-categories.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC3 Quản lý Categories  
> `![Activity Diagram – Quản lý Categories](./diagrams/activity-adm-03-categories.png)`

#### Sequence Diagram – UC3: Quản lý Categories

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Quản lý Categories    -->
<!-- Tên file gợi ý: sequence-adm-03-categories.png               -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-adm-03-categories.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC3 Quản lý Categories  
> `![Sequence Diagram – Quản lý Categories](./diagrams/sequence-adm-03-categories.png)`

---

### UC4 – Cấu hình commission

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ADM-04 |
| **Tên** | Cấu hình commission |
| **Actor** | Admin |
| **Mô tả** | Admin thiết lập tỷ lệ phần trăm hoa hồng mà hệ thống thu trên mỗi giao dịch bán vé |
| **Tiền điều kiện** | Admin đã đăng nhập; quyền cấu hình tài chính |
| **Hậu điều kiện** | Tỷ lệ commission mới được áp dụng cho các giao dịch tiếp theo |
| **Luồng chính** | 1. Admin truy cập trang "Cấu hình hệ thống" → mục Commission<br>2. Xem tỷ lệ commission hiện tại<br>3. Nhập tỷ lệ mới (% trên mỗi vé)<br>4. Xác nhận thay đổi → Hệ thống lưu cấu hình<br>5. Log thay đổi (ai, khi nào, từ % nào sang % nào) |
| **Luồng thay thế** | 3a. Nhập tỷ lệ ngoài khoảng hợp lệ (0–100%) → Báo lỗi |
| **Ngoại lệ** | Thay đổi không ảnh hưởng đến giao dịch đã hoàn tất |

#### Activity Diagram – UC4: Cấu hình commission

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Cấu hình commission   -->
<!-- Tên file gợi ý: activity-adm-04-commission.png               -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-adm-04-commission.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC4 Cấu hình commission  
> `![Activity Diagram – Cấu hình commission](./diagrams/activity-adm-04-commission.png)`

#### Sequence Diagram – UC4: Cấu hình commission

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Cấu hình commission   -->
<!-- Tên file gợi ý: sequence-adm-04-commission.png               -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-adm-04-commission.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC4 Cấu hình commission  
> `![Sequence Diagram – Cấu hình commission](./diagrams/sequence-adm-04-commission.png)`

---

### UC5 – Báo cáo toàn hệ thống

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ADM-05 |
| **Tên** | Báo cáo toàn hệ thống |
| **Actor** | Admin |
| **Mô tả** | Admin xem tổng quan dashboard với các chỉ số: doanh thu, số người dùng, số sự kiện, top Organizer, top sự kiện |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | Admin nắm được tình trạng hoạt động của toàn hệ thống |
| **Luồng chính** | 1. Admin truy cập trang Dashboard<br>2. Hệ thống tổng hợp dữ liệu: tổng doanh thu, commission thu được, số Organizer, số Attendee, số sự kiện theo trạng thái<br>3. Hiển thị biểu đồ doanh thu theo tháng, top sự kiện, top Organizer<br>4. Admin lọc theo khoảng thời gian, xuất báo cáo PDF |
| **Luồng thay thế** | 4a. Xuất PDF → Tạo file báo cáo đầy đủ |
| **Ngoại lệ** | Dữ liệu rỗng (hệ thống mới) → Hiển thị dashboard trống |

#### Activity Diagram – UC5: Báo cáo toàn hệ thống

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Báo cáo toàn hệ thống -->
<!-- Tên file gợi ý: activity-adm-05-dashboard.png                -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-adm-05-dashboard.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC5 Báo cáo toàn hệ thống  
> `![Activity Diagram – Báo cáo toàn hệ thống](./diagrams/activity-adm-05-dashboard.png)`

#### Sequence Diagram – UC5: Báo cáo toàn hệ thống

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Báo cáo toàn hệ thống -->
<!-- Tên file gợi ý: sequence-adm-05-dashboard.png                -->
<!-- Các đối tượng: Admin → DashboardPage → ReportController      -->
<!--   → ReportService → OrderRepository, EventRepository         -->
<!--   → UserRepository → (aggregate) → Response                 -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-adm-05-dashboard.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC5 Báo cáo toàn hệ thống  
> `![Sequence Diagram – Báo cáo toàn hệ thống](./diagrams/sequence-adm-05-dashboard.png)`

---

### UC6 – Quản lý thông báo hệ thống

#### Đặc tả Use Case

| Trường | Nội dung |
|--------|----------|
| **Mã UC** | UC-ADM-06 |
| **Tên** | Quản lý thông báo hệ thống |
| **Actor** | Admin |
| **Mô tả** | Admin tạo và gửi thông báo hệ thống (bảo trì, cập nhật, khuyến mãi) đến tất cả hoặc một nhóm người dùng |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | Thông báo được gửi đến đúng nhóm đối tượng; hiển thị trong notification center |
| **Luồng chính** | 1. Admin truy cập trang "Thông báo hệ thống"<br>2. Soạn thông báo: tiêu đề, nội dung, loại (thông tin/cảnh báo/bảo trì)<br>3. Chọn nhóm nhận: tất cả / chỉ Organizer / chỉ Attendee<br>4. Đặt lịch gửi hoặc gửi ngay<br>5. Hệ thống gửi thông báo (in-app + email tuỳ loại)<br>6. Lưu lịch sử thông báo |
| **Luồng thay thế** | 4a. Đặt lịch → Lưu vào queue, gửi đúng giờ |
| **Ngoại lệ** | Gửi thất bại → Log lỗi, retry tự động |

#### Activity Diagram – UC6: Quản lý thông báo hệ thống

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Activity Diagram – Quản lý thông báo     -->
<!-- Tên file gợi ý: activity-adm-06-notifications.png            -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: activity-adm-06-notifications.png ]
```

> ⚠️ **Chỗ nhúng hình:** Activity Diagram – UC6 Quản lý thông báo hệ thống  
> `![Activity Diagram – Quản lý thông báo hệ thống](./diagrams/activity-adm-06-notifications.png)`

#### Sequence Diagram – UC6: Quản lý thông báo hệ thống

<!-- ============================================================ -->
<!-- 🖼️ NHÚNG HÌNH ẢNH: Sequence Diagram – Quản lý thông báo     -->
<!-- Tên file gợi ý: sequence-adm-06-notifications.png            -->
<!-- ============================================================ -->

```
[ Nhúng hình ảnh: sequence-adm-06-notifications.png ]
```

> ⚠️ **Chỗ nhúng hình:** Sequence Diagram – UC6 Quản lý thông báo hệ thống  
> `![Sequence Diagram – Quản lý thông báo hệ thống](./diagrams/sequence-adm-06-notifications.png)`

---

*Tài liệu phân tích thiết kế hệ thống – Nhóm 1 – Đề tài 6: Event Management System*  
*Cập nhật lần cuối: 29/04/2026*
