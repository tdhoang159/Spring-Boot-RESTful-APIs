import type {
    CategoriesResponse,
    CategoryItem,
    EventRegistration,
    EventRegistrationsResponse,
    OrganizerEvent,
    OrganizerEventsResponse,
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
    organizerId: number;
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
    ticketTypes: Array<{
        ticketName: string;
        description: string;
        price: number;
        quantityTotal: number;
        maxPerOrder: number;
        saleStartTime: string;
        saleEndTime: string;
    }>;
};

export const createOrganizerEvent = async (organizerId: number, payload: CreateEventPayload) => {
    const response = await fetch(`${API_BASE_URL}/organizers/${organizerId}/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(payload),
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
