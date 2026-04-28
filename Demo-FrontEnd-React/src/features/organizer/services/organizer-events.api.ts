import type {
    CategoriesResponse,
    CategoryItem,
    EventRegistration,
    EventRegistrationsResponse,
    OrganizerEmailHistoryResponse,
    OrganizerEvent,
    OrganizerEventsResponse,
    TicketCheckinInfo,
    TicketSalesReportData,
    TicketSalesReportResponse,
} from "../types/organizer-event.types";

const API_BASE_URL = "http://localhost:8080/api";

const getFallbackOrganizerId = (): number => {
    const raw = localStorage.getItem("demo_organizer_id");
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) ? parsed : 1;
};

export const resolveOrganizerId = (): number => getFallbackOrganizerId();

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || `Request failed with status ${response.status}`);
    }
    return (await response.json()) as T;
};

export const fetchOrganizerEvents = async (organizerId: number): Promise<OrganizerEvent[]> => {
    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/events`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    const body = await parseJsonResponse<OrganizerEventsResponse>(response);
    return body.data ?? [];
};

type CreateEventPayload = {
    categoryId: number;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    city: string;
    venueName: string;
    venueAddress: string;
    meetingUrl: string | null;
    startTime: string;
    endTime: string;
    registrationDeadline: string | null;
    locationType: string;
    publishStatus?: string;
    approvalStatus?: string;
    ticketTypes: Array<{
        ticketTypeId?: number;
        ticketName: string;
        description: string;
        price: number;
        quantityTotal: number;
        maxPerOrder: number;
        saleStartTime: string;
        saleEndTime: string;
    }>;
    banner?: File | null;
};

export type UpdateEventPayload = CreateEventPayload;

const appendEventPayloadToFormData = (formData: FormData, payload: CreateEventPayload) => {
    formData.append("categoryId", String(payload.categoryId));
    formData.append("title", payload.title);
    formData.append("slug", payload.slug);
    formData.append("shortDescription", payload.shortDescription);
    formData.append("description", payload.description);
    formData.append("city", payload.city);
    formData.append("venueName", payload.venueName);
    formData.append("venueAddress", payload.venueAddress);
    formData.append("locationType", payload.locationType);

    if (payload.meetingUrl) {
        formData.append("meetingUrl", payload.meetingUrl);
    }

    if (payload.publishStatus) {
        formData.append("publishStatus", payload.publishStatus);
    }

    if (payload.approvalStatus) {
        formData.append("approvalStatus", payload.approvalStatus);
    }

    formData.append("startTime", payload.startTime);
    formData.append("endTime", payload.endTime);

    if (payload.registrationDeadline) {
        formData.append("registrationDeadline", payload.registrationDeadline);
    }

    payload.ticketTypes.forEach((ticket, index) => {
        if (ticket.ticketTypeId) {
            formData.append(`ticketTypes[${index}].ticketTypeId`, String(ticket.ticketTypeId));
        }
        formData.append(`ticketTypes[${index}].ticketName`, ticket.ticketName);
        formData.append(`ticketTypes[${index}].description`, ticket.description);
        formData.append(`ticketTypes[${index}].price`, String(ticket.price));
        formData.append(`ticketTypes[${index}].quantityTotal`, String(ticket.quantityTotal));
        formData.append(`ticketTypes[${index}].maxPerOrder`, String(ticket.maxPerOrder));
        formData.append(`ticketTypes[${index}].saleStartTime`, ticket.saleStartTime);
        formData.append(`ticketTypes[${index}].saleEndTime`, ticket.saleEndTime);
    });

    if (payload.banner) {
        formData.append("banner", payload.banner);
    }
};

export const createOrganizerEvent = async (organizerId: number, payload: CreateEventPayload) => {
    const formData = new FormData();
    appendEventPayloadToFormData(formData, payload);

    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/events`, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
        body: formData,
    });
    await parseJsonResponse<unknown>(response);
};

export const updateOrganizerEvent = async (
    organizerId: number,
    eventId: number,
    payload: UpdateEventPayload,
) => {
    const formData = new FormData();
    appendEventPayloadToFormData(formData, payload);

    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/events/${eventId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
        },
        body: formData,
    });

    await parseJsonResponse<unknown>(response);
};

export const fetchCategories = async (): Promise<CategoryItem[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    const body = await parseJsonResponse<CategoriesResponse>(response);
    return (body.data ?? []).filter((item) => item.status === "ACTIVE");
};

export const publishOrganizerEvent = async (organizerId: number, eventId: number) => {
    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/events/${eventId}/publish`, {
        method: "PATCH",
    });
    await parseJsonResponse<unknown>(response);
};

export const unpublishOrganizerEvent = async (organizerId: number, eventId: number) => {
    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/events/${eventId}/unpublish`, {
        method: "PATCH",
    });
    await parseJsonResponse<unknown>(response);
};

export const fetchEventRegistrations = async (
    organizerId: number,
    eventId: number,
): Promise<EventRegistration[]> => {
    const response = await fetch(
        `${API_BASE_URL}/organizers/${organizerId}/events/${eventId}/registrations`,
        {
            method: "GET",
            headers: { Accept: "application/json" },
        },
    );
    const body = await parseJsonResponse<EventRegistrationsResponse>(response);
    return body.data ?? [];
};

export const fetchOrganizerEmailHistory = async (
    organizerId: number,
    params: {
        eventId?: number;
        sendStatus?: string;
        page?: number;
        size?: number;
    },
): Promise<OrganizerEmailHistoryResponse["data"]> => {
    const queryParams = new URLSearchParams();
    if (params.eventId != null) {
        queryParams.set("eventId", String(params.eventId));
    }
    if (params.sendStatus) {
        queryParams.set("sendStatus", params.sendStatus);
    }
    queryParams.set("page", String(params.page ?? 0));
    queryParams.set("size", String(params.size ?? 10));
    const query = queryParams.toString();
    const response = await fetch(
        `${API_BASE_URL}/organizers/${organizerId}/email-history?${query}`,
        {
            method: "GET",
            headers: { Accept: "application/json" },
        },
    );

    const body = await parseJsonResponse<OrganizerEmailHistoryResponse>(response);
    return body.data;
};

export const fetchTicketSalesReport = async (
    organizerId: number,
    params: { month?: number; year?: number },
): Promise<TicketSalesReportData> => {
    const queryParams = new URLSearchParams();
    if (params.month != null) queryParams.set("month", String(params.month));
    if (params.year != null) queryParams.set("year", String(params.year));
    const query = queryParams.toString();
    const response = await fetch(
        `${API_BASE_URL}/organizers/${organizerId}/ticket-sales-report?${query}`,
        { method: "GET", headers: { Accept: "application/json" } },
    );
    const body = await parseJsonResponse<TicketSalesReportResponse>(response);
    return body.data;
};

type SendEventEmailApiResponse = {
    status: string;
    message: string;
    data: { campaignId: number; recipientCount: number; message: string };
    errorCode: string | null;
};

export const sendEventEmail = async (
    organizerId: number,
    eventId: number,
    payload: { subject: string; content: string },
): Promise<{ campaignId: number; recipientCount: number; message: string }> => {
    const response = await fetch(
        `${API_BASE_URL}/organizers/${organizerId}/events/${eventId}/send-email`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        },
    );
    const body = await parseJsonResponse<SendEventEmailApiResponse>(response);
    return body.data;
};

type CheckinApiResponse = {
    status: string;
    message: string;
    data: TicketCheckinInfo;
    errorCode: string | null;
};

export const scanTicket = async (
    organizerId: number,
    ticketCode: string,
    eventId?: number,
): Promise<TicketCheckinInfo> => {
    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/tickets/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ticketCode, eventId: eventId ?? null }),
    });
    const body = await parseJsonResponse<CheckinApiResponse>(response);
    return body.data;
};

export const checkInTicket = async (
    organizerId: number,
    payload: { ticketCode: string; eventId?: number; gateName?: string; note?: string },
): Promise<TicketCheckinInfo> => {
    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/tickets/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            ticketCode: payload.ticketCode,
            eventId: payload.eventId ?? null,
            gateName: payload.gateName || null,
            note: payload.note || null,
        }),
    });
    const body = await parseJsonResponse<CheckinApiResponse>(response);
    return body.data;
};
