export type OrganizerInfo = {
    organizerId: number;
    organizationName: string;
    userId: number;
    userFullName: string;
};

export type EventCategory = {
    categoryId: number;
    categoryName: string;
};

export type CategoryItem = {
    categoryId: number;
    categoryName: string;
    description: string | null;
    status: string;
    createdAt: string;
};

export type TicketTypeInfo = {
    ticketTypeId: number;
    ticketName: string;
    description: string | null;
    price: number;
    quantityTotal: number;
    maxPerOrder: number;
    saleStartTime: string | null;
    saleEndTime: string | null;
    status: string;
};

export type OrganizerEvent = {
    eventId: number;
    organizer: OrganizerInfo;
    category: EventCategory | null;
    title: string;
    slug: string;
    shortDescription: string | null;
    description: string | null;
    bannerUrl: string | null;
    venueName: string | null;
    venueAddress: string | null;
    city: string | null;
    locationType: "OFFLINE" | "ONLINE" | "HYBRID" | string;
    meetingUrl: string | null;
    startTime: string;
    endTime: string;
    registrationDeadline: string | null;
    publishStatus: "PUBLISHED" | "UNPUBLISHED" | "DRAFT" | string;
    approvalStatus: "APPROVED" | "PENDING" | "REJECTED" | "DRAFT" | string;
    createdAt: string;
    updatedAt: string | null;
    ticketTypes: TicketTypeInfo[];
};

export type OrganizerEventsResponse = {
    status: string;
    message: string;
    data: OrganizerEvent[];
    errorCode: string | null;
    timeStamp: string;
};

export type CategoriesResponse = {
    status: string;
    message: string;
    data: CategoryItem[];
    errorCode: string | null;
    timeStamp: string;
};

export type RegistrationTicket = {
    ticketId: number;
    orderItemId: number;
    ticketTypeId: number;
    ticketTypeName: string;
    ticketCode: string;
    attendeeName: string;
    attendeeEmail: string;
    status: "VALID" | "USED" | "CANCELLED" | "EXPIRED" | string;
    issuedAt: string;
    checkedInAt: string | null;
};

export type EventRegistration = {
    orderId: number;
    userId: number;
    eventId: number;
    fullName: string;
    email: string;
    phone: string | null;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string | null;
    totalTickets: number;
    finalAmount: number;
    paymentStatus: "UNPAID" | "PAID" | "FAILED" | "REFUNDED" | string;
    orderStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED" | string;
    registeredAt: string;
    tickets: RegistrationTicket[];
};

export type EventRegistrationsResponse = {
    status: string;
    message: string;
    data: EventRegistration[];
    errorCode: string | null;
    timeStamp: string;
};

export type OrganizerEmailHistoryItem = {
    campaignId: number;
    eventId: number;
    eventTitle: string;
    subject: string;
    content: string;
    sendStatus: string;
    sentAt: string | null;
    createdAt: string;
};

export type SpringPage<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
};

export type OrganizerEmailHistoryResponse = {
    status: string;
    message: string;
    data: SpringPage<OrganizerEmailHistoryItem>;
    errorCode: string | null;
    timeStamp: string;
};

export type EventTicketSalesSummary = {
    eventId: number;
    eventTitle: string;
    paidOrders: number;
    ticketsSold: number;
    revenue: number;
};

export type TicketSalesReportData = {
    organizerId: number;
    month: number | null;
    year: number | null;
    totalOrders: number;
    paidOrders: number;
    ticketsSold: number;
    revenue: number;
    eventSummaries: EventTicketSalesSummary[];
};

export type TicketSalesReportResponse = {
    status: string;
    message: string;
    data: TicketSalesReportData;
    errorCode: string | null;
};

export type TicketCheckinInfo = {
    ticketCode: string;
    status: string;
    attendeeName: string;
    attendeeEmail: string;
    eventId: number;
    eventTitle: string;
    ticketTypeId: number;
    ticketTypeName: string;
    issuedAt: string;
    checkedIn: boolean;
    checkedInAt: string | null;
};

export type CheckinApiResponse = {
    status: string;
    message: string;
    data: TicketCheckinInfo;
    errorCode: string | null;
};
