import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import PlaceIcon from "@mui/icons-material/Place";
import { useState } from "react";
import { useOrganizerEvents } from "../context/organizer-events.context";

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const OrganizerSendEmailPage = () => {
    const { events, isLoading, error, refreshEvents } = useOrganizerEvents();
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    const selectedEvent = events.find((e) => String(e.eventId) === selectedEventId) ?? null;
    const estimatedRecipients = selectedEvent
        ? selectedEvent.ticketTypes.reduce((sum, ticket) => sum + ticket.quantityTotal, 0)
        : 0;

    const handleSend = () => {
        if (!selectedEventId || !selectedEvent) {
            alert("Vui long chon su kien truoc khi gui email.");
            return;
        }
        const payload = { eventId: Number(selectedEventId), subject, content };
        console.log("Send email payload:", payload);
        alert(`Da tao payload gui email cho su kien: ${selectedEvent.title}`);
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Gui Email Thong Bao
                </Typography>
                <Button variant="outlined" onClick={() => void refreshEvents()}>
                    Tai lai su kien
                </Button>
            </Stack>

            {error ? <Typography color="error">{error}</Typography> : null}

            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Chon su kien *
                            </Typography>
                            <Select
                                displayEmpty
                                value={selectedEventId}
                                onChange={(e: SelectChangeEvent) => setSelectedEventId(e.target.value)}
                                fullWidth
                                size="small"
                            >
                                <MenuItem value="" disabled>
                                    -- Chon su kien --
                                </MenuItem>
                                {events.map((ev) => (
                                    <MenuItem key={ev.eventId} value={String(ev.eventId)}>
                                        {ev.title}
                                    </MenuItem>
                                ))}
                            </Select>
                            {isLoading ? <Typography color="text.secondary">Dang tai su kien...</Typography> : null}
                        </Stack>

                        {selectedEvent && (
                            <Box
                                sx={{
                                    bgcolor: "rgba(11,53,88,0.04)",
                                    borderRadius: 3,
                                    border: "1px solid rgba(11,53,88,0.1)",
                                    p: 2,
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {selectedEvent.title}
                                        </Typography>
                                        <Chip
                                            label={selectedEvent.publishStatus === "PUBLISHED" ? "Da phat hanh" : "Chua phat hanh"}
                                            color={selectedEvent.publishStatus === "PUBLISHED" ? "success" : "default"}
                                            size="small"
                                        />
                                    </Stack>
                                    <Divider />
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                            <CalendarMonthIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDateTime(selectedEvent.startTime)}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                            <PlaceIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {(selectedEvent.venueName ?? "Chua co dia diem")}, {selectedEvent.city ?? "N/A"}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                            <GroupIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {estimatedRecipients} luot ve da tao
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        )}

                        <Divider />

                        <TextField
                            fullWidth
                            label="Tieu de email"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={!selectedEventId}
                        />
                        <TextField
                            fullWidth
                            multiline
                            minRows={6}
                            label="Noi dung"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={!selectedEventId}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            disabled={!selectedEventId || !subject.trim() || !content.trim()}
                            sx={{ width: "fit-content" }}
                        >
                            Gui Email
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
};

export default OrganizerSendEmailPage;
