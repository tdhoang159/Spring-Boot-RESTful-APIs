import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useOrganizerEvents } from "../context/organizer-events.context";
import { fetchEventRegistrations } from "../services/organizer-events.api";
import type { EventRegistration, RegistrationTicket } from "../types/organizer-event.types";

const PAYMENT_STATUS_OPTIONS = ["ALL", "UNPAID", "PAID", "FAILED", "REFUNDED"] as const;
const ORDER_STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"] as const;

const getPaymentColor = (status: string): "default" | "success" | "error" | "warning" | "info" => {
  switch (status) {
    case "PAID": return "success";
    case "UNPAID": return "warning";
    case "FAILED": return "error";
    case "REFUNDED": return "info";
    default: return "default";
  }
};

const getOrderColor = (status: string): "default" | "success" | "error" | "warning" | "primary" => {
  switch (status) {
    case "CONFIRMED": return "success";
    case "PENDING": return "warning";
    case "CANCELLED": return "error";
    case "EXPIRED": return "default";
    default: return "primary";
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const getTicketStatusColor = (status: string): "default" | "success" | "error" | "warning" => {
  switch (status) {
    case "VALID": return "success";
    case "USED": return "default";
    case "CANCELLED": return "error";
    case "EXPIRED": return "warning";
    default: return "default";
  }
};

const OrganizerRegistrationsPage = () => {
  const { organizerId, events, error: eventsError, refreshEvents } = useOrganizerEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");

  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoadingRegs, setIsLoadingRegs] = useState(false);
  const [regsError, setRegsError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [orderFilter, setOrderFilter] = useState<string>("ALL");

  const [ticketDialogReg, setTicketDialogReg] = useState<EventRegistration | null>(null);

  useEffect(() => {
    if (selectedEventId === "ALL") {
      setRegistrations([]);
      setRegsError(null);
      setIsLoadingRegs(true);
      // Load all events registrations — fetch for each event
      const allEvents = events;
      if (allEvents.length === 0) {
        setIsLoadingRegs(false);
        return;
      }
      Promise.all(
        allEvents.map((ev) => fetchEventRegistrations(organizerId, ev.eventId))
      )
        .then((results) => setRegistrations(results.flat()))
        .catch((err: unknown) => setRegsError(err instanceof Error ? err.message : "Loi tai danh sach"))
        .finally(() => setIsLoadingRegs(false));
      return;
    }
    setIsLoadingRegs(true);
    setRegsError(null);
    fetchEventRegistrations(organizerId, Number(selectedEventId))
      .then(setRegistrations)
      .catch((err: unknown) => setRegsError(err instanceof Error ? err.message : "Loi tai danh sach"))
      .finally(() => setIsLoadingRegs(false));
  }, [organizerId, selectedEventId, events]);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return registrations.filter((r) => {
      if (q && !r.buyerName.toLowerCase().includes(q) && !r.buyerEmail.toLowerCase().includes(q)) return false;
      if (paymentFilter !== "ALL" && r.paymentStatus !== paymentFilter) return false;
      if (orderFilter !== "ALL" && r.orderStatus !== orderFilter) return false;
      return true;
    });
  }, [registrations, searchText, paymentFilter, orderFilter]);

  const handleEventChange = (e: SelectChangeEvent) => {
    setSelectedEventId(e.target.value);
    setSearchText("");
    setPaymentFilter("ALL");
    setOrderFilter("ALL");
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Danh Sach Nguoi Dang Ky
        </Typography>
        <Button variant="outlined" onClick={() => void refreshEvents()}>
          Tai lai su kien
        </Button>
      </Stack>

      {eventsError ? <Typography color="error">{eventsError}</Typography> : null}

      {/* Filters row — event selector + payment + order status at same level */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ flexWrap: "wrap", alignItems: { sm: "center" } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            Su kien:
          </Typography>
          <Select
            size="small"
            value={selectedEventId}
            onChange={handleEventChange}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="ALL">Tat ca su kien</MenuItem>
            {events.map((event) => (
              <MenuItem key={event.eventId} value={String(event.eventId)}>
                {event.title}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <TextField
          size="small"
          placeholder="Tim theo ten, email nguoi mua..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ minWidth: 240 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            Thanh toan:
          </Typography>
          <Select
            size="small"
            value={paymentFilter}
            onChange={(e: SelectChangeEvent) => setPaymentFilter(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s === "ALL" ? "Tat ca" : s}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            Don hang:
          </Typography>
          <Select
            size="small"
            value={orderFilter}
            onChange={(e: SelectChangeEvent) => setOrderFilter(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            {ORDER_STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s === "ALL" ? "Tat ca" : s}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      {/* Table */}
      <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          {isLoadingRegs ? (
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">Dang tai du lieu...</Typography>
            </Box>
          ) : regsError ? (
            <Box sx={{ p: 3 }}>
              <Typography color="error">{regsError}</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "rgba(11,53,88,0.04)" } }}>
                    <TableCell>#</TableCell>
                    <TableCell>Ten nguoi mua</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>So dien thoai</TableCell>
                    <TableCell align="center">So ve</TableCell>
                    <TableCell align="right">Tong tien</TableCell>
                    <TableCell align="center">Thanh toan</TableCell>
                    <TableCell align="center">Don hang</TableCell>
                    <TableCell>Thoi gian dang ky</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        Khong co du lieu phu hop.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((reg, idx) => (
                      <TableRow
                        key={reg.orderId}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => setTicketDialogReg(reg)}
                      >
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{reg.buyerName}</TableCell>
                        <TableCell>{reg.buyerEmail}</TableCell>
                        <TableCell>{reg.buyerPhone ?? "—"}</TableCell>
                        <TableCell align="center">{reg.totalTickets}</TableCell>
                        <TableCell align="right">{formatCurrency(reg.finalAmount)}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={reg.paymentStatus}
                            color={getPaymentColor(reg.paymentStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={reg.orderStatus}
                            color={getOrderColor(reg.orderStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {new Date(reg.registeredAt).toLocaleString("vi-VN")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {!isLoadingRegs && !regsError ? (
        <Typography variant="body2" color="text.secondary">
          Hien thi {filtered.length} / {registrations.length} don dang ky
        </Typography>
      ) : null}

      {/* Ticket detail dialog */}
      <Dialog
        open={Boolean(ticketDialogReg)}
        onClose={() => setTicketDialogReg(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Danh sach ve — {ticketDialogReg?.buyerName}
            </Typography>
            <Button variant="outlined" size="small" onClick={() => setTicketDialogReg(null)}>
              Dong
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0, pb: 2 }}>
          {ticketDialogReg && ticketDialogReg.tickets.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Typography color="text.secondary">Don hang nay chua co ve nao.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "rgba(11,53,88,0.04)" } }}>
                    <TableCell>#</TableCell>
                    <TableCell>Ma ve</TableCell>
                    <TableCell>Loai ve</TableCell>
                    <TableCell>Ten nguoi tham du</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">Trang thai</TableCell>
                    <TableCell>Thoi gian cap</TableCell>
                    <TableCell>Check-in</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(ticketDialogReg?.tickets ?? []).map((ticket: RegistrationTicket, idx: number) => (
                    <TableRow key={ticket.ticketId} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                        {ticket.ticketCode}
                      </TableCell>
                      <TableCell>{ticket.ticketTypeName}</TableCell>
                      <TableCell>{ticket.attendeeName}</TableCell>
                      <TableCell>{ticket.attendeeEmail}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={ticket.status}
                          color={getTicketStatusColor(ticket.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {new Date(ticket.issuedAt).toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {ticket.checkedInAt
                          ? new Date(ticket.checkedInAt).toLocaleString("vi-VN")
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default OrganizerRegistrationsPage;
