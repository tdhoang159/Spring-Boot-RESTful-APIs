import { Navigate, Outlet, createBrowserRouter } from "react-router";
import ProtectedRoute from "../components/common/ProtectedRoute";
import MainLayout from "../layouts/main.layout";
import CheckoutPage from "../pages/checkout.page";
import EventDetailPage from "../pages/event-detail.page";
import EventsPage from "../pages/events.page";
import HomePage from "../pages/home.page";
import LoginPage from "../pages/login.page";
import NotFoundPage from "../pages/not-found.page";
import OrderDetailPage from "../pages/order-detail.page";
import OrdersPage from "../pages/orders.page";
import PaymentPage from "../pages/payment.page";
import PaymentSuccessPage from "../pages/payment-success.page";
import TicketDetailPage from "../pages/ticket-detail.page";
import TicketsPage from "../pages/tickets.page";
import AppLayout from "./layouts/app.layout";
import AttendeeHomePage from "../features/attendee/pages/attendee-home.page";
import PortalLoginPage from "../features/auth/pages/login.page";
import RegisterPage from "../features/auth/pages/register.page";
import {
  getCurrentUser,
  getHomePathByRole,
} from "../features/auth/services/auth.service";
import type { UserRole } from "../features/auth/services/auth.service";
import { OrganizerEventsScope } from "../features/organizer/context/organizer-events.context";
import OrganizerCreateEventPage from "../features/organizer/pages/organizer-create-event.page";
import OrganizerEmailHistoryPage from "../features/organizer/pages/organizer-email-history.page";
import OrganizerEventPage from "../features/organizer/pages/organizer-events.page";
import OrganizerHomePage from "../features/organizer/pages/organizer-home.page";
import OrganizerRegistrationsPage from "../features/organizer/pages/organizer-registrations.page";
import OrganizerSalesReportPage from "../features/organizer/pages/organizer-sales-report.page";
import OrganizerSendEmailPage from "../features/organizer/pages/organizer-send-email.page";
import ProfilePage from "../features/shared/pages/profile.page";

const RequirePortalAuth = () => {
  if (!getCurrentUser()) {
    return <Navigate to="/portal/login" replace />;
  }

  return <Outlet />;
};

const RequireRole = ({ role }: { role: UserRole }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/portal/login" replace />;
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

const RedirectToRoleHome = () => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/portal/login" replace />;
  }

  return <Navigate to={getHomePathByRole(user.role)} replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "events", element: <EventsPage /> },
      { path: "events/:slug", element: <EventDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "events/:slug/checkout", element: <CheckoutPage /> },
          { path: "payment", element: <PaymentPage /> },
          { path: "payment/success", element: <PaymentSuccessPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "orders/:orderCode", element: <OrderDetailPage /> },
          { path: "tickets", element: <TicketsPage /> },
          { path: "tickets/:ticketCode", element: <TicketDetailPage /> },
        ],
      },
    ],
  },
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: "/portal/login", element: <PortalLoginPage /> },
      { path: "/portal/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <RequirePortalAuth />,
    children: [
      {
        path: "/portal",
        element: <AppLayout />,
        children: [
          { index: true, element: <RedirectToRoleHome /> },
          { path: "profile", element: <ProfilePage /> },
          {
            element: <RequireRole role="ATTENDEE" />,
            children: [{ path: "attendee", element: <AttendeeHomePage /> }],
          },
          {
            element: <RequireRole role="ORGANIZER" />,
            children: [
              {
                element: <OrganizerEventsScope />,
                children: [
                  { path: "organizer", element: <OrganizerHomePage /> },
                  { path: "organizer/create-event", element: <OrganizerCreateEventPage /> },
                  { path: "organizer/events", element: <OrganizerEventPage /> },
                  { path: "organizer/registrations", element: <OrganizerRegistrationsPage /> },
                  { path: "organizer/send-email", element: <OrganizerSendEmailPage /> },
                  { path: "organizer/email-history", element: <OrganizerEmailHistoryPage /> },
                  { path: "organizer/sales-report", element: <OrganizerSalesReportPage /> },
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
