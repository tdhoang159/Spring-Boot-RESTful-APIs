# API Inventory

Project: `Spring-Boot-RESTful-APIs`

Generated from source scan of `BackEnd-SpringBoot/src/main/java` and `SecurityConfig`.

## Scan Result

- `@RestController` found: `11`
- `@Controller` found: `0`
- Total endpoints found: `57`
- Swagger / OpenAPI: `not found`
  - No `springdoc`, `swagger`, or `openapi` dependency/configuration was found in `pom.xml` or Java config.

## Security Rules

These rules come from `BackEnd-SpringBoot/src/main/java/com/truongduchoang/SpringBootRESTfullAPIs/security/SecurityConfig.java`.

| Rule | Effective permission |
| --- | --- |
| `GET /api/v1/events/**` | `permitAll` |
| `POST /api/auth/login` | `permitAll` |
| `POST /api/sepay/webhook` | `permitAll` |
| `/api/admin/organizers/**` | `ROLE_ADMIN` |
| `/api/organizers/*/**` | `ROLE_ADMIN` or `ROLE_ORGANIZER` |
| `/api/orders/**` | `authenticated` |
| `/api/tickets/**` | `authenticated` |
| `POST /api/sepay/qr` | `authenticated` |
| `GET /api/sepay/status/**` | `authenticated` |
| everything else | `permitAll` |

## Summary

| Module | Endpoints |
| --- | ---: |
| System / Demo APIs | 2 |
| Auth APIs | 1 |
| User APIs | 12 |
| Todo APIs | 6 |
| Category APIs | 5 |
| Event APIs | 9 |
| Order APIs | 3 |
| Ticket APIs | 2 |
| Payment / SePay APIs | 3 |
| Organizer APIs | 9 |
| Admin Organizer APIs | 5 |
| Total | 57 |

## System / Demo APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/` | `HelloWorldController` | `index` | `-` | `ResponseEntity<String>` | `permitAll` |
| GET | `/demo` | `HelloWorldController` | `demo` | `-` | `ResponseEntity<Todo>` | `permitAll` |

## Auth APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login` | `AuthController` | `login` | `body: LoginRequest` | `ApiResponse<AuthResponse>` | `permitAll` |

## User APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/users` | `UserController` | `createApiUser` | `body: UserCreateRequest` | `ApiResponse<UserResponse>` | `permitAll` |
| POST | `/api/users` | `UserController` | `createApiUserWithAvatar` | `multipart: UserCreateRequest + avatar` | `ApiResponse<UserResponse>` | `permitAll` |
| GET | `/api/users` | `UserController` | `getApiUsers` | `-` | `ApiResponse<List<UserResponse>>` | `permitAll` |
| GET | `/api/users/{id}` | `UserController` | `getApiUserById` | `path: id` | `ApiResponse<UserResponse>` | `permitAll` |
| PUT | `/api/users/{id}` | `UserController` | `updateApiUser` | `path: id, body: UserUpdateRequest` | `ApiResponse<UserResponse>` | `permitAll` |
| PUT | `/api/users/{id}` | `UserController` | `updateApiUserWithAvatar` | `path: id, multipart: UserUpdateRequest + avatar` | `ApiResponse<UserResponse>` | `permitAll` |
| DELETE | `/api/users/{id}` | `UserController` | `deleteApiUser` | `path: id` | `ApiResponse<Void>` | `permitAll` |
| POST | `/users` | `UserController` | `createUser` | `body: User` | `ApiResponse<User>` | `permitAll` |
| GET | `/users` | `UserController` | `getAllUsers` | `-` | `ApiResponse<List<User>>` | `permitAll` |
| GET | `/users/{id}` | `UserController` | `getUserById` | `path: id` | `ApiResponse<User>` | `permitAll` |
| PUT | `/users/{id}` | `UserController` | `updateUser` | `path: id, body: User` | `ApiResponse<User>` | `permitAll` |
| DELETE | `/users/{id}` | `UserController` | `deleteUser` | `path: id` | `ApiResponse<Void>` | `permitAll` |

Notes:
- `/api/users/**` is the newer DTO-based API.
- `/users/**` is a legacy API that exposes entity `User` directly.

## Todo APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/todos` | `TodoController` | `createTodo` | `body: Todo` | `Todo` | `permitAll` |
| GET | `/todos/{id}` | `TodoController` | `getTodoById` | `path: id` | `Todo` | `permitAll` |
| GET | `/todos` | `TodoController` | `getAllTodos` | `-` | `List<Todo>` | `permitAll` |
| PUT | `/todos/{id}` | `TodoController` | `updateTodoUsingPUT` | `path: id, body: Todo` | `Todo` | `permitAll` |
| PATCH | `/todos/{id}` | `TodoController` | `updateTodoUsingPATCH` | `path: id, body: Todo` | `Todo` | `permitAll` |
| DELETE | `/todos/{id}` | `TodoController` | `deleteTodo` | `path: id` | `String` | `permitAll` |

## Category APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/categories` | `CategoryController` | `createCategory` | `body: CategoryCreateRequest` | `ApiResponse<CategoryResponse>` | `permitAll` |
| GET | `/api/categories` | `CategoryController` | `getAllCategories` | `-` | `ApiResponse<List<CategoryResponse>>` | `permitAll` |
| GET | `/api/categories/{id}` | `CategoryController` | `getCategoryById` | `path: id` | `ApiResponse<CategoryResponse>` | `permitAll` |
| PUT | `/api/categories/{id}` | `CategoryController` | `updateCategory` | `path: id, body: CategoryUpdateRequest` | `ApiResponse<CategoryResponse>` | `permitAll` |
| DELETE | `/api/categories/{id}` | `CategoryController` | `deleteCategory` | `path: id` | `ApiResponse<Void>` | `permitAll` |

## Event APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/events` | `EventController` | `createEvent` | `body: EventCreateRequest` | `ApiResponse<EventResponse>` | `permitAll` |
| POST | `/api/events` | `EventController` | `createEventWithBanner` | `multipart: EventCreateRequest + banner` | `ApiResponse<EventResponse>` | `permitAll` |
| GET | `/api/events` | `EventController` | `getAllEvents` | `-` | `ApiResponse<List<EventResponse>>` | `permitAll` |
| GET | `/api/events/{id}` | `EventController` | `getEventById` | `path: id` | `ApiResponse<EventResponse>` | `permitAll` |
| PUT | `/api/events/{id}` | `EventController` | `updateEvent` | `path: id, body: EventUpdateRequest` | `ApiResponse<EventResponse>` | `permitAll` |
| PUT | `/api/events/{id}` | `EventController` | `updateEventWithBanner` | `path: id, multipart: EventUpdateRequest + banner` | `ApiResponse<EventResponse>` | `permitAll` |
| DELETE | `/api/events/{id}` | `EventController` | `deleteEvent` | `path: id` | `ApiResponse<Void>` | `permitAll` |
| GET | `/api/v1/events` | `EventController` | `getApprovedEvents` | `query(model): keyword, categoryId, city, date, locationType, page, size, sortBy, sortDir` | `Page<EventSummaryResponse>` | `permitAll` |
| GET | `/api/v1/events/{slug}` | `EventController` | `getApprovedEventBySlug` | `path: slug` | `EventDetailResponse` | `permitAll` |

Notes:
- `/api/events/**` is a CRUD/admin-style API but is currently public because it falls through to `anyRequest().permitAll()`.
- `/api/v1/events/**` is the public browse API consumed by the frontend.

## Order APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/orders` | `OrderController` | `createOrder` | `body: OrderCreateRequest` | `ApiResponse<OrderResponse>` | `authenticated` |
| GET | `/api/orders/{orderCode}` | `OrderController` | `getOrder` | `path: orderCode` | `ApiResponse<OrderResponse>` | `authenticated` |
| GET | `/api/orders/my` | `OrderController` | `getMyOrders` | `-` | `ApiResponse<List<OrderResponse>>` | `authenticated` |

## Ticket APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/tickets/my` | `TicketController` | `getMyTickets` | `-` | `ApiResponse<List<TicketResponse>>` | `authenticated` |
| GET | `/api/tickets/{ticketCode}` | `TicketController` | `getTicketByCode` | `path: ticketCode` | `ApiResponse<TicketResponse>` | `authenticated` |

## Payment / SePay APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/sepay/qr` | `SepayController` | `createQr` | `body: CreateQrRequest` | `ApiResponse<CreateQrResponse>` | `authenticated` |
| GET | `/api/sepay/status/{orderId}` | `SepayController` | `getPaymentStatus` | `path: orderId` | `ApiResponse<PaymentStatusResponse>` | `authenticated` |
| POST | `/api/sepay/webhook` | `SepayController` | `handleWebhook` | `body: SepayWebhookRequest` | `Map<String, Boolean>` | `permitAll` |

## Organizer APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| GET | `/api/organizers/{organizerId}/events` | `OrganizerController` | `getOrganizerEvents` | `path: organizerId, query: publishStatus` | `ApiResponse<List<EventResponse>>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| GET | `/api/organizers/{organizerId}/ticket-sales-report` | `OrganizerController` | `getTicketSalesReport` | `path: organizerId, query: month, year` | `ApiResponse<TicketSalesReportResponse>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| GET | `/api/organizers/{organizerId}/events/{eventId}/registrations` | `OrganizerController` | `getEventRegistrations` | `path: organizerId, eventId` | `ApiResponse<List<EventRegistrationResponse>>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| GET | `/api/organizers/{organizerId}/email-history` | `OrganizerController` | `getOrganizerEmailHistory` | `path: organizerId, query: eventId` | `ApiResponse<List<OrganizerEmailHistoryResponse>>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| POST | `/api/organizers/{organizerId}/events` | `OrganizerController` | `createEvent` | `path: organizerId, body: EventCreateRequest` | `ApiResponse<EventResponse>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| PATCH | `/api/organizers/{organizerId}/events/{eventId}/publish` | `OrganizerController` | `publishEvent` | `path: organizerId, eventId` | `ApiResponse<EventResponse>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| PATCH | `/api/organizers/{organizerId}/events/{eventId}/unpublish` | `OrganizerController` | `unpublishEvent` | `path: organizerId, eventId` | `ApiResponse<EventResponse>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| POST | `/api/organizers/{organizerId}/events/{eventId}/send-email` | `OrganizerController` | `sendEventEmail` | `path: organizerId, eventId, body: SendEventEmailRequest` | `ApiResponse<SendEventEmailResponse>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| POST | `/api/organizers/{organizerId}/tickets/scan` | `OrganizerController` | `scanTicketForCheckin` | `path: organizerId, body: TicketCheckinRequest` | `ApiResponse<TicketCheckinResponse>` | `ROLE_ADMIN or ROLE_ORGANIZER` |
| POST | `/api/organizers/{organizerId}/tickets/check-in` | `OrganizerController` | `checkInTicket` | `path: organizerId, body: TicketCheckinRequest` | `ApiResponse<TicketCheckinResponse>` | `ROLE_ADMIN or ROLE_ORGANIZER` |

## Admin Organizer APIs

| Method | URL | Controller | Function | Request | Response | Role |
| --- | --- | --- | --- | --- | --- | --- |
| POST | `/api/admin/organizers` | `AdminOrganizerController` | `createOrganizer` | `body: AdminOrganizerCreateRequest` | `ApiResponse<AdminOrganizerResponse>` | `ROLE_ADMIN` |
| GET | `/api/admin/organizers` | `AdminOrganizerController` | `getAllOrganizers` | `-` | `ApiResponse<List<AdminOrganizerResponse>>` | `ROLE_ADMIN` |
| GET | `/api/admin/organizers/{id}` | `AdminOrganizerController` | `getOrganizerById` | `path: id` | `ApiResponse<AdminOrganizerResponse>` | `ROLE_ADMIN` |
| PUT | `/api/admin/organizers/{id}` | `AdminOrganizerController` | `updateOrganizer` | `path: id, body: AdminOrganizerUpdateRequest` | `ApiResponse<AdminOrganizerResponse>` | `ROLE_ADMIN` |
| DELETE | `/api/admin/organizers/{id}` | `AdminOrganizerController` | `deleteOrganizer` | `path: id` | `ApiResponse<Void>` | `ROLE_ADMIN` |

## Validation Review

Good coverage:

- `AuthController.login` uses `@Valid LoginRequest`
- `CategoryController` create/update uses `@Valid`
- `EventController` create/update uses `@Valid`
- `OrderController.createOrder` uses `@Valid OrderCreateRequest`
- `SepayController.createQr` uses `@Valid CreateQrRequest`
- `UserController` DTO endpoints use `@Valid`
- `AdminOrganizerController` create/update uses `@Valid`
- `OrganizerController` scan/check-in uses `@Valid TicketCheckinRequest`

Gaps:

- `POST /api/organizers/{organizerId}/events`
  - `EventCreateRequest` has field constraints, but controller method does not use `@Valid`.
- `POST /api/organizers/{organizerId}/events/{eventId}/send-email`
  - `SendEventEmailRequest` has no Bean Validation constraints and method does not use `@Valid`.
- `POST /api/sepay/webhook`
  - `SepayWebhookRequest` has no Bean Validation constraints and method does not use `@Valid`.
- `POST/PUT/PATCH /todos/**`
  - `Todo` has no Bean Validation constraints and controller methods do not use `@Valid`.
- `EventCreateRequest.ticketTypes`
  - `TicketTypeCreateRequest` has validation annotations, but `ticketTypes` is not marked with `@Valid`, so nested ticket validation may not run.

## Duplicate / Overloaded Routes

No hard collisions were found after considering `HTTP method + URL + consumes`.

Routes overloaded by content type:

- `POST /api/users`
  - JSON: `createApiUser`
  - multipart: `createApiUserWithAvatar`
- `PUT /api/users/{id}`
  - JSON: `updateApiUser`
  - multipart: `updateApiUserWithAvatar`
- `POST /api/events`
  - JSON: `createEvent`
  - multipart: `createEventWithBanner`
- `PUT /api/events/{id}`
  - JSON: `updateEvent`
  - multipart: `updateEventWithBanner`

## Candidate Unused APIs

This section means "not referenced by the frontend service layer in `Demo-FrontEnd-React/src/services` and `Demo-FrontEnd-React/src/features/organizer/services`, or only covered by tests".

Likely legacy / demo only:

- `/`
- `/demo`
- `/todos/**`
- `/users/**`

Not used by current frontend service layer:

- `/api/users/**`
- `/api/events` CRUD endpoints
- `/api/admin/organizers/**`
- `/api/organizers/{organizerId}/ticket-sales-report`
- `/api/organizers/{organizerId}/email-history`
- `/api/organizers/{organizerId}/events/{eventId}/send-email`
- `/api/organizers/{organizerId}/tickets/scan`
- `/api/organizers/{organizerId}/tickets/check-in`

Expected backend-to-backend / external callback:

- `/api/sepay/webhook`

Test-covered controllers found:

- `CategoryControllerIT`
- `EventControllerIT`
- `UserControllerIT`

No dedicated controller integration tests were found for:

- `AuthController`
- `OrderController`
- `TicketController`
- `SepayController`
- `OrganizerController`
- `AdminOrganizerController`
- `TodoController`
- `HelloWorldController`

## APIs Without Fine-Grained Authorization

Public mutating endpoints:

- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `POST /api/events`
- `PUT /api/events/{id}`
- `DELETE /api/events/{id}`
- all `/todos/**` write endpoints

Observation:

- These endpoints are not protected by `@PreAuthorize` / `@Secured`.
- They also do not match any restrictive rule in `SecurityConfig`, so they are effectively public.

## Naming / Versioning Suggestions

- Standardize all modern APIs under `/api/v1/**`.
- Deprecate legacy endpoints that skip `/api`, especially `/users/**`, `/todos/**`, `/`, and `/demo`.
- Prefer one canonical user API:
  - keep DTO-based `/api/v1/users/**`
  - remove entity-based `/users/**`
- Consider aligning event management endpoints:
  - public browse: `/api/v1/events/**`
  - internal CRUD: `/api/v1/admin/events/**` or `/api/v1/organizers/{organizerId}/events/**`
- Consider more RESTful names for action endpoints:
  - `POST /api/organizers/{organizerId}/events/{eventId}/send-email`
    - candidate: `/api/v1/organizers/{organizerId}/events/{eventId}/email-campaigns`
  - `POST /api/organizers/{organizerId}/tickets/scan`
    - candidate: `/api/v1/organizers/{organizerId}/ticket-checkins/preview`
  - `POST /api/organizers/{organizerId}/tickets/check-in`
    - candidate: `/api/v1/organizers/{organizerId}/ticket-checkins`
- If Swagger UI is desired, add `springdoc-openapi-starter-webmvc-ui` and publish `/v3/api-docs` plus `/swagger-ui.html`.
