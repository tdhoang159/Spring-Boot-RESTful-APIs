import { Navigate, Outlet, createBrowserRouter } from "react-router";
import AppLayout from "./layouts/app.layout";
import LoginPage from "../features/auth/pages/login.page";
import RegisterPage from "../features/auth/pages/register.page";
import {
  getCurrentUser,
  getHomePathByRole,
} from "../features/auth/services/auth.service";
import type { UserRole } from "../features/auth/services/auth.service";
import AttendeeHomePage from "../features/attendee/pages/attendee-home.page";
import OrganizerHomePage from "../features/organizer/pages/organizer-home.page";
import OrganizerCreateEventPage from "../features/organizer/pages/organizer-create-event.page";
import OrganizerEventPage from "../features/organizer/pages/organizer-events.page";
import OrganizerRegistrationsPage from "../features/organizer/pages/organizer-registrations.page";
import OrganizerSendEmailPage from "../features/organizer/pages/organizer-send-email.page";
import OrganizerSalesReportPage from "../features/organizer/pages/organizer-sales-report.page";
import OrganizerEmailHistoryPage from "../features/organizer/pages/organizer-email-history.page";
import { OrganizerEventsScope } from "../features/organizer/context/organizer-events.context";
import ProfilePage from "../features/shared/pages/profile.page";

const RequireAuth = () => {
  if (!getCurrentUser()) {
    return <Navigate to="/login" replace />;
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

const RedirectToRoleHome = () => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePathByRole(user.role)} replace />;
};

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuthed />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
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
    element: <RedirectToRoleHome />,
  },
]);
