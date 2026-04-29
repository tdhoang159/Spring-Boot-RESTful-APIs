import { Navigate, Outlet, createBrowserRouter, useLocation, useParams } from "react-router";
import CheckoutPage from "../features/attendee/pages/checkout.page";
import EventDetailPage from "../features/attendee/pages/event-detail.page";
import EventsPage from "../features/attendee/pages/events.page";
import HomePage from "../features/attendee/pages/home.page";
import NotFoundPage from "../features/attendee/pages/not-found.page";
import OrderDetailPage from "../features/attendee/pages/order-detail.page";
import OrdersPage from "../features/attendee/pages/orders.page";
import PaymentPage from "../features/attendee/pages/payment.page";
import PaymentSuccessPage from "../features/attendee/pages/payment-success.page";
import TicketDetailPage from "../features/attendee/pages/ticket-detail.page";
import TicketsPage from "../features/attendee/pages/tickets.page";
import AppLayout from "./layouts/app.layout";
import PortalLoginPage from "../features/auth/pages/login.page";
import RegisterPage from "../features/auth/pages/register.page";
import {
  getCurrentUser,
  getHomePathByRole,
} from "../features/auth/services/auth.service";
import type { UserRole } from "../features/auth/services/auth.service";
import { OrganizerEventsScope } from "../features/organizer/context/organizer-events.context";
import OrganizerCheckinPage from "../features/organizer/pages/organizer-checkin.page";
import OrganizerCreateEventPage from "../features/organizer/pages/organizer-create-event.page";
import OrganizerEmailHistoryPage from "../features/organizer/pages/organizer-email-history.page";
import OrganizerEventPage from "../features/organizer/pages/organizer-events.page";
import OrganizerHomePage from "../features/organizer/pages/organizer-home.page";
import OrganizerRegistrationsPage from "../features/organizer/pages/organizer-registrations.page";
import OrganizerSalesReportPage from "../features/organizer/pages/organizer-sales-report.page";
import OrganizerSendEmailPage from "../features/organizer/pages/organizer-send-email.page";
import ProfilePage from "../features/shared/pages/profile.page";

const RequirePortalAuth = () => {
  const location = useLocation();

  if (!getCurrentUser()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
};

const RequireRole = ({ role }: { role: UserRole }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return <Outlet />;
};

const RedirectIfAuthed = () => {
  const user = getCurrentUser();
  if (user) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return <Outlet />;
};

const RedirectWithSearch = ({ to }: { to: string }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
};

const RedirectLegacyAttendeeEventDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  return <Navigate to={`/events/${slug}${location.search}`} replace />;
};

const RedirectLegacyAttendeeCheckout = () => {
  const { slug } = useParams();
  const location = useLocation();
  return <Navigate to={`/events/${slug}/checkout${location.search}`} replace />;
};

const RedirectLegacyOrderDetail = () => {
  const { orderCode } = useParams();
  const location = useLocation();
  return <Navigate to={`/orders/${orderCode}${location.search}`} replace />;
};

const RedirectLegacyTicketDetail = () => {
  const { ticketCode } = useParams();
  const location = useLocation();
  return <Navigate to={`/tickets/${ticketCode}${location.search}`} replace />;
};

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: "/login", element: <PortalLoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:slug", element: <EventDetailPage /> },
      { path: "attendee", element: <Navigate to="/" replace /> },
      { path: "attendee/events", element: <RedirectWithSearch to="/events" /> },
      { path: "attendee/events/:slug", element: <RedirectLegacyAttendeeEventDetail /> },
      { path: "attendee/events/:slug/checkout", element: <RedirectLegacyAttendeeCheckout /> },
      { path: "attendee/payment", element: <RedirectWithSearch to="/payment" /> },
      { path: "attendee/payment/success", element: <RedirectWithSearch to="/payment/success" /> },
      { path: "attendee/orders", element: <RedirectWithSearch to="/orders" /> },
      { path: "attendee/orders/:orderCode", element: <RedirectLegacyOrderDetail /> },
      { path: "attendee/tickets", element: <RedirectWithSearch to="/tickets" /> },
      { path: "attendee/tickets/:ticketCode", element: <RedirectLegacyTicketDetail /> },
      {
        element: <RequirePortalAuth />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { element: <RequireRole role="ATTENDEE" />, children: [
            { path: "events/:slug/checkout", element: <CheckoutPage /> },
            { path: "payment", element: <PaymentPage /> },
            { path: "payment/success", element: <PaymentSuccessPage /> },
            { path: "orders", element: <OrdersPage /> },
            { path: "orders/:orderCode", element: <OrderDetailPage /> },
            { path: "tickets", element: <TicketsPage /> },
            { path: "tickets/:ticketCode", element: <TicketDetailPage /> },
          ] },
          {
            element: <RequireRole role="ORGANIZER" />,
            children: [
              {
                path: "organizer",
                element: <OrganizerEventsScope />,
                children: [
                  { index: true, element: <OrganizerHomePage /> },
                  { path: "create-event", element: <OrganizerCreateEventPage /> },
                  { path: "events", element: <OrganizerEventPage /> },
                  { path: "registrations", element: <OrganizerRegistrationsPage /> },
                  { path: "checkin", element: <OrganizerCheckinPage /> },
                  { path: "send-email", element: <OrganizerSendEmailPage /> },
                  { path: "email-history", element: <OrganizerEmailHistoryPage /> },
                  { path: "sales-report", element: <OrganizerSalesReportPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
