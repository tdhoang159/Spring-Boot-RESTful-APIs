import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import AppLayout from "./Layout.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import ProtectedRoute from "./components/common/ProtectedRoute.tsx";
import HomePage from "./pages/home.page.tsx";
import EventsPage from "./pages/events.page.tsx";
import EventDetailPage from "./pages/event-detail.page.tsx";
import CheckoutPage from "./pages/checkout.page.tsx";
import PaymentPage from "./pages/payment.page.tsx";
import PaymentSuccessPage from "./pages/payment-success.page.tsx";
import OrdersPage from "./pages/orders.page.tsx";
import OrderDetailPage from "./pages/order-detail.page.tsx";
import TicketsPage from "./pages/tickets.page.tsx";
import TicketDetailPage from "./pages/ticket-detail.page.tsx";
import NotFoundPage from "./pages/not-found.page.tsx";
import LoginPage from "./pages/login.page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
