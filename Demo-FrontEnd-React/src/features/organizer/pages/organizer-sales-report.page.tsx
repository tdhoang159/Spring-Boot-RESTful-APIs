import {
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useOrganizerEvents } from "../context/organizer-events.context";

const OrganizerSalesReportPage = () => {
    const { events, error, refreshEvents } = useOrganizerEvents();
    const [month, setMonth] = useState("4");
    const [year, setYear] = useState("2026");
    const [selectedEventId, setSelectedEventId] = useState<string>("ALL");

    const selectedEvent = useMemo(
        () => events.find((event) => String(event.eventId) === selectedEventId) ?? null,
        [events, selectedEventId],
    );

    const metrics = useMemo(() => {
        const multiplier = Number(month) / 4;
        const baseCapacity = selectedEvent
            ? selectedEvent.ticketTypes.reduce((sum, ticket) => sum + ticket.quantityTotal, 0)
            : events.reduce(
                (sum, event) => sum + event.ticketTypes.reduce((eventSum, ticket) => eventSum + ticket.quantityTotal, 0),
                0,
            );

        return {
            totalTickets: Math.round(baseCapacity * multiplier),
            revenue: Math.round(baseCapacity * 199000 * multiplier),
            checkedIn: Math.round(baseCapacity * 0.7 * multiplier),
        };
    }, [events, month, selectedEvent]);

    return (
        <Stack spacing={2.5}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Bao Cao Ban Ve
                </Typography>
                <Button variant="outlined" onClick={() => void refreshEvents()}>
                    Tai lai su kien
                </Button>
            </Stack>

            {error ? <Typography color="error">{error}</Typography> : null}

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Select
                        fullWidth
                        size="small"
                        value={selectedEventId}
                        onChange={(e: SelectChangeEvent) => setSelectedEventId(e.target.value)}
                    >
                        <MenuItem value="ALL">Tat ca su kien</MenuItem>
                        {events.map((event) => (
                            <MenuItem key={event.eventId} value={String(event.eventId)}>
                                {event.title}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField select fullWidth label="Thang" value={month} onChange={(e) => setMonth(e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <MenuItem key={m} value={String(m)}>
                                {m}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField select fullWidth label="Nam" value={year} onChange={(e) => setYear(e.target.value)}>
                        <MenuItem value="2025">2025</MenuItem>
                        <MenuItem value="2026">2026</MenuItem>
                        <MenuItem value="2027">2027</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                        <CardContent>
                            <Typography color="text.secondary">Tong ve da ban (uoc tinh)</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                {metrics.totalTickets}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                        <CardContent>
                            <Typography color="text.secondary">Tong doanh thu (uoc tinh)</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                {metrics.revenue.toLocaleString("vi-VN")} VND
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                        <CardContent>
                            <Typography color="text.secondary">So luot check-in (uoc tinh)</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                {metrics.checkedIn}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Typography color="text.secondary">
                {selectedEvent
                    ? `Nguon du lieu su kien: ${selectedEvent.title}`
                    : "Nguon du lieu: tong hop tat ca su kien cua organizer"}
            </Typography>
        </Stack>
    );
};

export default OrganizerSalesReportPage;
