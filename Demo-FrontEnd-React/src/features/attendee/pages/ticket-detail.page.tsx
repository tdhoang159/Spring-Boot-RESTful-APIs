import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import TicketQR from "../components/ticket/TicketQR";
import { getTicketDetailAPI } from "../services/ticket.api";
import type { Ticket } from "../services/ticket.api";

const TicketDetailPage: React.FC = () => {
  const { ticketCode } = useParams<{ ticketCode: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketCode) return;
    getTicketDetailAPI(ticketCode)
      .then(setTicket)
      .catch(() => navigate("/attendee/tickets"))
      .finally(() => setLoading(false));
  }, [ticketCode]);

  if (loading) {
    return <div style={styles.center}><Spin size="large" /></div>;
  }

  if (!ticket) return null;

  return (
    <div style={styles.wrap}>
      <button style={styles.back} onClick={() => navigate("/attendee/tickets")}>
        <ArrowLeftOutlined /> Vé của tôi
      </button>

      <TicketQR
        ticketCode={ticket.ticketCode}
        qrBase64={ticket.qrCode}
        attendeeName={ticket.attendeeName}
        eventTitle={ticket.eventTitle}
        eventStartTime={ticket.eventStartTime}
        eventLocation={ticket.eventLocation}
        ticketTypeName={ticket.ticketTypeName}
        status={ticket.status}
      />
    </div>
  );
};

export default TicketDetailPage;

const styles: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 420, margin: "0 auto", padding: "24px 24px 48px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 },
  back: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#828BA0", fontSize: 14, marginBottom: 24, padding: 0 },
};
