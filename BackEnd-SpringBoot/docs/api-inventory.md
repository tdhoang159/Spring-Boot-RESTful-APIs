# API Inventory - Spring-Boot-RESTful-APIs

Ngay quet: `2026-04-29`

## 1. Tong quan scan

- Da scan toan bo `BackEnd-SpringBoot/src/main/java`.
- Tim thay `11` class `@RestController`, `0` class `@Controller`.
- Tim thay `59` mapping annotations thuc te (`GET/POST/PUT/PATCH/DELETE`).
- Tong so route unique theo cap `HTTP method + URL`: `53`.
- Khong tim thay `@PreAuthorize` hoac `@Secured`.
- Khong tim thay Swagger/OpenAPI dependency trong `pom.xml` (`springdoc`, `swagger`, `openapi` deu khong co).

## 2. Summary theo module

| Module | So API |
|---|---:|
| Auth APIs | 1 |
| User APIs | 15 |
| Category APIs | 5 |
| Event APIs | 22 |
| Order APIs | 3 |
| Ticket APIs | 2 |
| Payment APIs | 3 |
| Todo APIs | 6 |
| System/Demo APIs | 2 |
| Tong cong | 59 |

## 3. Chi tiet API theo module

### 3.1. Auth APIs

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| POST | `/api/auth/login` | `AuthController` | `login` | Body JSON: `LoginRequest { email, password }` | `ApiResponse<AuthResponse>` | `permitAll` trong `SecurityConfig` |

### 3.2. User APIs

#### User Profile APIs

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| GET | `/api/users/me/profile` | `UserProfileController` | `getProfile` | - | `ApiResponse<UserProfileResponse>` | `authenticated` trong `SecurityConfig` |
| PUT | `/api/users/me/profile` | `UserProfileController` | `updateProfile` | FormData: `UserProfileUpdateRequest { fullName/name, phone }` + optional file `avatar` | `ApiResponse<UserProfileResponse>` | `authenticated` trong `SecurityConfig` |
| PATCH | `/api/users/me/profile/password` | `UserProfileController` | `changePassword` | Body JSON: `ChangePasswordRequest { currentPassword, newPassword, confirmPassword }` | `ApiResponse<Void>` | `authenticated` trong `SecurityConfig` |

#### User CRUD APIs (`/api/users`)

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| POST | `/api/users` | `UserController` | `createApiUser` | Body JSON: `UserCreateRequest { roleId, fullName/name, email, phone, passwordHash, status }` | `ApiResponse<UserResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| POST | `/api/users` | `UserController` | `createApiUserWithAvatar` | FormData: `UserCreateRequest { roleId, fullName/name, email, phone, passwordHash, status }` + optional file `avatar` | `ApiResponse<UserResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/users` | `UserController` | `getApiUsers` | - | `ApiResponse<List<UserResponse>>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/users/{id}` | `UserController` | `getApiUserById` | Path: `id` | `ApiResponse<UserResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/api/users/{id}` | `UserController` | `updateApiUser` | Path: `id`; Body JSON: `UserUpdateRequest { roleId, fullName/name, email, phone, passwordHash, status }` | `ApiResponse<UserResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/api/users/{id}` | `UserController` | `updateApiUserWithAvatar` | Path: `id`; FormData: `UserUpdateRequest { roleId, fullName/name, email, phone, passwordHash, status }` + optional file `avatar` | `ApiResponse<UserResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| DELETE | `/api/users/{id}` | `UserController` | `deleteApiUser` | Path: `id` | `ApiResponse<Void>` | Khong co role; roi vao `anyRequest().permitAll()` |

#### Legacy User APIs (`/users`)

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| POST | `/users` | `UserController` | `createUser` | Body JSON: `User { userId?, role?, email, fullName/name, phone, passwordHash, avatarUrl?, status, ... }` | `ApiResponse<User>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/users` | `UserController` | `getAllUsers` | - | `ApiResponse<List<User>>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/users/{id}` | `UserController` | `getUserById` | Path: `id` | `ApiResponse<User>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/users/{id}` | `UserController` | `updateUser` | Path: `id`; Body JSON: `User { userId?, role?, email, fullName/name, phone, passwordHash, avatarUrl?, status, ... }` | `ApiResponse<User>` | Khong co role; roi vao `anyRequest().permitAll()` |
| DELETE | `/users/{id}` | `UserController` | `deleteUser` | Path: `id` | `ApiResponse<Void>` | Khong co role; roi vao `anyRequest().permitAll()` |

### 3.3. Category APIs

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| POST | `/api/categories` | `CategoryController` | `createCategory` | Body JSON: `CategoryCreateRequest { categoryName, description, status }` | `ApiResponse<CategoryResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/categories` | `CategoryController` | `getAllCategories` | - | `ApiResponse<List<CategoryResponse>>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/categories/{id}` | `CategoryController` | `getCategoryById` | Path: `id` | `ApiResponse<CategoryResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/api/categories/{id}` | `CategoryController` | `updateCategory` | Path: `id`; Body JSON: `CategoryUpdateRequest { categoryName, description, status }` | `ApiResponse<CategoryResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| DELETE | `/api/categories/{id}` | `CategoryController` | `deleteCategory` | Path: `id` | `ApiResponse<Void>` | Khong co role; roi vao `anyRequest().permitAll()` |

### 3.4. Event APIs

#### Core Event CRUD APIs (`/api/events`)

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| POST | `/api/events` | `EventController` | `createEvent` | Body JSON: `EventCreateRequest { organizerId, categoryId, title, slug, shortDescription, description, venueName, venueAddress, city, locationType, meetingUrl, startTime, endTime, registrationDeadline, publishStatus, approvalStatus, ticketTypes[] }` | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| POST | `/api/events` | `EventController` | `createEventWithBanner` | FormData: `EventCreateRequest { organizerId, categoryId, title, slug, shortDescription, description, venueName, venueAddress, city, locationType, meetingUrl, startTime, endTime, registrationDeadline, publishStatus, approvalStatus, ticketTypes[] }` + optional file `banner` | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/events` | `EventController` | `getAllEvents` | - | `ApiResponse<List<EventResponse>>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/events/{id}` | `EventController` | `getEventById` | Path: `id` | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/api/events/{id}` | `EventController` | `updateEvent` | Path: `id`; Body JSON: `EventUpdateRequest { organizerId, categoryId, title, slug, shortDescription, description, venueName, venueAddress, city, locationType, meetingUrl, startTime, endTime, registrationDeadline, publishStatus, approvalStatus, ticketTypes[] }` | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/api/events/{id}` | `EventController` | `updateEventWithBanner` | Path: `id`; FormData: `EventUpdateRequest { organizerId, categoryId, title, slug, shortDescription, description, venueName, venueAddress, city, locationType, meetingUrl, startTime, endTime, registrationDeadline, publishStatus, approvalStatus, ticketTypes[] }` + optional file `banner` | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| DELETE | `/api/events/{id}` | `EventController` | `deleteEvent` | Path: `id` | `ApiResponse<Void>` | Khong co role; roi vao `anyRequest().permitAll()` |

#### Public Event APIs (`/api/v1/events`)

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| GET | `/api/v1/events` | `EventController` | `getApprovedEvents` | Query: `EventSearchRequest { keyword, categoryId, city, date, locationType, page, size, sortBy, sortDir }` | `Page<EventSummaryResponse>` | `permitAll` trong `SecurityConfig` |
| GET | `/api/v1/events/{slug}` | `EventController` | `getApprovedEventBySlug` | Path: `slug` | `EventDetailResponse` | `permitAll` trong `SecurityConfig` |

#### Organizer/Admin-like Event APIs (`/api/organizers`)

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| GET | `/api/organizers/{organizerId}/events` | `OrganizerController` | `getOrganizerEvents` | Path: `organizerId`; Query optional: `publishStatus` | `ApiResponse<List<EventResponse>>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/organizers/{organizerId}/ticket-sales-report` | `OrganizerController` | `getTicketSalesReport` | Path: `organizerId`; Query optional: `month`, `year` | `ApiResponse<TicketSalesReportResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/organizers/{organizerId}/events/{eventId}/registrations` | `OrganizerController` | `getEventRegistrations` | Path: `organizerId`, `eventId` | `ApiResponse<List<EventRegistrationResponse>>` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/api/organizers/{organizerId}/email-history` | `OrganizerController` | `getOrganizerEmailHistory` | Path: `organizerId`; Query optional: `eventId`, `sendStatus`, `page`, `size` | `ApiResponse<Page<OrganizerEmailHistoryResponse>>` | Khong co role; roi vao `anyRequest().permitAll()` |
| POST | `/api/organizers/{organizerId}/events` | `OrganizerController` | `createEvent` | Path: `organizerId`; Body JSON: `EventCreateRequest` (controller set lai `organizerId` tu path) | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| POST | `/api/organizers/{organizerId}/events` | `OrganizerController` | `createEventWithBanner` | Path: `organizerId`; FormData: `EventCreateRequest` + optional file `banner` (controller set lai `organizerId` tu path) | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/api/organizers/{organizerId}/events/{eventId}` | `OrganizerController` | `updateOrganizerEvent` | Path: `organizerId`, `eventId`; Body JSON: `EventUpdateRequest` (controller set lai `organizerId` tu path) | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/api/organizers/{organizerId}/events/{eventId}` | `OrganizerController` | `updateOrganizerEventWithBanner` | Path: `organizerId`, `eventId`; FormData: `EventUpdateRequest` + optional file `banner` (controller set lai `organizerId` tu path) | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PATCH | `/api/organizers/{organizerId}/events/{eventId}/publish` | `OrganizerController` | `publishEvent` | Path: `organizerId`, `eventId` | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PATCH | `/api/organizers/{organizerId}/events/{eventId}/unpublish` | `OrganizerController` | `unpublishEvent` | Path: `organizerId`, `eventId` | `ApiResponse<EventResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| POST | `/api/organizers/{organizerId}/events/{eventId}/send-email` | `OrganizerController` | `sendEventEmail` | Path: `organizerId`, `eventId`; Body JSON: `SendEventEmailRequest { subject, content }` | `ApiResponse<SendEventEmailResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| POST | `/api/organizers/{organizerId}/tickets/scan` | `OrganizerController` | `scanTicketForCheckin` | Path: `organizerId`; Body JSON: `TicketCheckinRequest { ticketCode, eventId?, gateName?, note? }` | `ApiResponse<TicketCheckinResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |
| POST | `/api/organizers/{organizerId}/tickets/check-in` | `OrganizerController` | `checkInTicket` | Path: `organizerId`; Body JSON: `TicketCheckinRequest { ticketCode, eventId?, gateName?, note? }` | `ApiResponse<TicketCheckinResponse>` | Khong co role; roi vao `anyRequest().permitAll()` |

### 3.5. Order APIs

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| POST | `/api/orders` | `OrderController` | `createOrder` | Body JSON: `OrderCreateRequest { eventId, buyerName, buyerEmail, buyerPhone, items[] }`, trong do `items[] = OrderItemRequest { ticketTypeId, quantity }` | `ApiResponse<OrderResponse>` | `authenticated` trong `SecurityConfig` |
| GET | `/api/orders/{orderCode}` | `OrderController` | `getOrder` | Path: `orderCode` | `ApiResponse<OrderResponse>` | `authenticated` trong `SecurityConfig` |
| GET | `/api/orders/my` | `OrderController` | `getMyOrders` | - | `ApiResponse<List<OrderResponse>>` | `authenticated` trong `SecurityConfig` |

### 3.6. Ticket APIs

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| GET | `/api/tickets/my` | `TicketController` | `getMyTickets` | - | `ApiResponse<List<TicketResponse>>` | `authenticated` trong `SecurityConfig` |
| GET | `/api/tickets/{ticketCode}` | `TicketController` | `getTicketByCode` | Path: `ticketCode` | `ApiResponse<TicketResponse>` | `authenticated` trong `SecurityConfig` |

### 3.7. Payment APIs

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| POST | `/api/sepay/qr` | `SepayController` | `createQr` | Body JSON: `CreateQrRequest { orderId }` | `ApiResponse<CreateQrResponse>` | `authenticated` trong `SecurityConfig` |
| GET | `/api/sepay/status/{orderId}` | `SepayController` | `getPaymentStatus` | Path: `orderId` | `ApiResponse<PaymentStatusResponse>` | `authenticated` trong `SecurityConfig` |
| POST | `/api/sepay/webhook` | `SepayController` | `handleWebhook` | Body JSON: `SepayWebhookRequest { id, transferType, transferAmount, content, accountNumber, transactionDate, referenceCode, accumulated, description }` | `Map<String, Boolean>` | `permitAll` trong `SecurityConfig` |

### 3.8. Todo APIs

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| POST | `/todos` | `TodoController` | `createTodo` | Body JSON: `Todo { id?, userName, isCompleted }` | `Todo` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/todos/{id}` | `TodoController` | `getTodoById` | Path: `id` | `Todo` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/todos` | `TodoController` | `getAllTodos` | - | `List<Todo>` | Khong co role; roi vao `anyRequest().permitAll()` |
| PUT | `/todos/{id}` | `TodoController` | `updateTodoUsingPUT` | Path: `id`; Body JSON: `Todo { id?, userName, isCompleted }` | `Todo` | Khong co role; roi vao `anyRequest().permitAll()` |
| PATCH | `/todos/{id}` | `TodoController` | `updateTodoUsingPATCH` | Path: `id`; Body JSON: `Todo { id?, userName, isCompleted }` | `Todo` | Khong co role; roi vao `anyRequest().permitAll()` |
| DELETE | `/todos/{id}` | `TodoController` | `deleteTodo` | Path: `id` | `String` | Khong co role; roi vao `anyRequest().permitAll()` |

### 3.9. System/Demo APIs

| METHOD | URL | CONTROLLER | FUNCTION | REQUEST | RESPONSE | PERMISSION |
|---|---|---|---|---|---|---|
| GET | `/` | `HelloWorldController` | `index` | - | `String` | Khong co role; roi vao `anyRequest().permitAll()` |
| GET | `/demo` | `HelloWorldController` | `demo` | - | `Todo` | Khong co role; roi vao `anyRequest().permitAll()` |

## 4. API trung URL / trung route

Khong tim thay xung dot route truc tiep gay trung mapping trong Spring, nhung co `6` cap route trung `method + URL` va duoc phan biet bang `consumes`:

| METHOD | URL | Bien the |
|---|---|---|
| POST | `/api/users` | `application/json` va `multipart/form-data` |
| PUT | `/api/users/{id}` | `application/json` va `multipart/form-data` |
| POST | `/api/events` | `application/json` va `multipart/form-data` |
| PUT | `/api/events/{id}` | `application/json` va `multipart/form-data` |
| POST | `/api/organizers/{organizerId}/events` | `application/json` va `multipart/form-data` |
| PUT | `/api/organizers/{organizerId}/events/{eventId}` | `application/json` va `multipart/form-data` |

Luu y bo sung:

- `/api/orders/my` va `/api/orders/{orderCode}` khong trung vi Spring uu tien literal path `/my`.
- `/api/tickets/my` va `/api/tickets/{ticketCode}` cung tuong tu.

## 5. API co the chua duoc su dung trong repo

Kiem tra static reference trong `Demo-FrontEnd-React/src` cho thay:

### Da thay duoc frontend goi toi

- `/api/auth/login`
- `/api/users/me/profile`
- `/api/users/me/profile/password`
- `/api/v1/events`
- `/api/v1/events/{slug}`
- `/api/orders`
- `/api/orders/my`
- `/api/orders/{orderCode}`
- `/api/tickets/my`
- `/api/tickets/{ticketCode}`
- `/api/sepay/qr`
- `/api/sepay/status/{orderId}`
- `/api/categories` (GET danh sach)
- Hầu het `/api/organizers/...` trong `organizer-events.api.ts`

### Khong thay duoc reference noi bo trong frontend

- Toan bo legacy `/users`
- Toan bo `/todos`
- `/`
- `/demo`
- Toan bo `/api/users`
- Hầu het `/api/events` CRUD
- `/api/categories/{id}`
- `POST/PUT/DELETE /api/categories`
- `/api/sepay/webhook`

Canh bao: day chi la static scan trong repo hien tai, khong khang dinh API do khong duoc Postman, mobile app, script hoac he thong ngoai goi toi.

## 6. API thieu validation hoac validation yeu

### Thieu `@Valid` hoac request DTO khong co bean validation huu ich

- `OrganizerController#sendEventEmail`: body `SendEventEmailRequest` khong co `@Valid`, DTO khong co `@NotBlank` cho `subject`, `content`.
- `SepayController#handleWebhook`: body `SepayWebhookRequest` khong co `@Valid`, DTO khong co rang buoc validation.
- `TodoController#createTodo`, `updateTodoUsingPUT`, `updateTodoUsingPATCH`: khong dung `@Valid`; `Todo` cung khong co bean validation annotation.

### Nested validation co nguy co khong chay

- `EventCreateRequest.ticketTypes` va `EventUpdateRequest.ticketTypes` khong gan `@Valid`.
- He qua: cac constraint ben trong `TicketTypeCreateRequest` (`eventId`, `ticketName`, `price`, `quantityTotal`, `maxPerOrder`, `saleStartTime`...) co the khong duoc kich hoat khi tao/cap nhat event.
- Pham vi anh huong:
  - `POST /api/events`
  - `PUT /api/events/{id}`
  - `POST /api/organizers/{organizerId}/events`
  - `PUT /api/organizers/{organizerId}/events/{eventId}`

### Validation chua chat

- `TicketTypeCreateRequest.ticketName` dang dung `@NotNull` thay vi `@NotBlank`, nen chuoi rong co the van lot qua.
- `CategoryUpdateRequest`, `UserUpdateRequest`, `EventUpdateRequest` cho phep body rat "long", day la chu dong thiet ke neu muon partial update bang `PUT`, nhung can xac nhan co dung y do nghiep vu khong.

## 7. API khong co phan quyen / role restriction

Khong co endpoint nao dung `@PreAuthorize` hay `@Secured`. Toan bo enforcement hien tai di qua `SecurityConfig`.

### Dang duoc protect bang `authenticated`

- `/api/users/me/profile/**`
- `/api/orders/**`
- `/api/tickets/**`
- `POST /api/sepay/qr`
- `GET /api/sepay/status/**`

### Dang `permitAll`

- `/api/auth/login`
- `POST /api/sepay/webhook`
- `GET /api/v1/events/**`
- Toan bo route con lai do `anyRequest().permitAll()`, bao gom ca:
  - `/api/users/**`
  - `/api/categories/**`
  - `/api/events/**`
  - `/api/organizers/**`
  - `/users/**`
  - `/todos/**`
  - `/`
  - `/demo`

Canh bao quan trong:

- Cac route co tinh chat admin/quan tri nhu tao user, tao/sua/xoa category, tao/sua/xoa event, thao tac organizer hien dang public neu khong co layer check bo sung o service.

## 8. Swagger / OpenAPI

Khong tim thay:

- dependency `springdoc-openapi-starter-webmvc-ui`
- dependency `springfox`
- annotation `@Operation`, `@Tag`, `@OpenAPIDefinition`

Ket luan:

- Project hien chua co Swagger/OpenAPI.
- Tai lieu nay duoc export thu cong duoi dang Markdown.
- Neu muon co `/v3/api-docs` va Swagger UI, co the bo sung `springdoc-openapi-starter-webmvc-ui`.

## 9. De xuat cai thien naming va versioning

### Naming

- Nen hop nhat bo legacy `/users` va bo DTO-based `/api/users` thanh mot he API duy nhat, tranh song song 2 chuan response/entity.
- `PATCH /api/organizers/{organizerId}/events/{eventId}/publish` va `/unpublish` co the chuyen thanh:
  - `PATCH /api/v1/organizers/{organizerId}/events/{eventId}`
  - Body: `{ "publishStatus": "PUBLISHED" }` hoac `{ "publishStatus": "UNPUBLISHED" }`
- `/api/orders/my` va `/api/tickets/my` co the chuan hoa thanh `/api/v1/me/orders` va `/api/v1/me/tickets` neu muon REST naming dong nhat hon.
- `POST /api/sepay/qr` co the doi thanh route nghiep vu ro hon, vi du:
  - `/api/v1/orders/{orderId}/payment-qr`
  - hoac `/api/v1/payments/sepay/qr`

### Versioning

- Hien chi co public event APIs dung version `/api/v1/...`.
- Nen thong nhat toan bo API ve mot prefix, vi du:
  - `/api/v1/auth/login`
  - `/api/v1/users`
  - `/api/v1/categories`
  - `/api/v1/events`
  - `/api/v1/orders`
  - `/api/v1/tickets`
  - `/api/v1/organizers/...`
- Co the giu backward compatibility bang cach deprecate dan:
  - public route cu
  - legacy `/users`
  - `/todos` neu chi de demo

## 10. Goi y de dua vao Postman/Swagger ve sau

- Tach ro `public`, `authenticated`, `organizer/admin`.
- Standard hoa wrapper response:
  - Hien tai mot so route tra `ApiResponse<T>`, mot so route tra truc tiep `T` hoac `Page<T>`.
- Standard hoa `consumes`:
  - JSON route
  - multipart route
- Neu muon generate Swagger tu code:
  1. Them `springdoc-openapi-starter-webmvc-ui`
  2. Bo sung `@Tag`, `@Operation`, `@SecurityRequirement`
  3. Thong nhat model request/response
  4. Cau hinh security scheme JWT Bearer

