import {
    Alert,
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
import { sendEventEmail } from "../services/organizer-events.api";

const formatDateTime = (dt: string) =>
    new Date(dt).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const OrganizerSendEmailPage = () => {
    const { organizerId, events, isLoading, error, refreshEvents } = useOrganizerEvents();
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    const [sendSuccess, setSendSuccess] = useState<{ campaignId: number; recipientCount: number; message: string } | null>(null);

    const selectedEvent = events.find((e) => String(e.eventId) === selectedEventId) ?? null;
    const estimatedRecipients = selectedEvent
        ? selectedEvent.ticketTypes.reduce((sum, ticket) => sum + ticket.quantityTotal, 0)
        : 0;

    const handleSend = async () => {
        if (!selectedEventId || !selectedEvent) return;
        try {
            setIsSending(true);
            setSendError(null);
            setSendSuccess(null);
            const result = await sendEventEmail(organizerId, Number(selectedEventId), { subject, content });
            setSendSuccess(result);
            setSubject("");
            setContent("");
        } catch (err) {
            setSendError(err instanceof Error ? err.message : "Không thể gửi email.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Gửi Email Thông Báo
                </Typography>
                <Button variant="outlined" onClick={() => void refreshEvents()}>
                    Tải lại sự kiện
                </Button>
            </Stack>

            {error ? <Typography color="error">{error}</Typography> : null}
            {sendError ? <Alert severity="error">{sendError}</Alert> : null}
            {sendSuccess ? (
                <Alert severity="success">
                    Đã gửi thành công đến <strong>{sendSuccess.recipientCount}</strong> người nhận. (Campaign ID: {sendSuccess.campaignId})
                </Alert>
            ) : null}

            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Chọn sự kiện *
                            </Typography>
                            <Select
                                displayEmpty
                                value={selectedEventId}
                                onChange={(e: SelectChangeEvent) => setSelectedEventId(e.target.value)}
                                fullWidth
                                size="small"
                            >
                                <MenuItem value="" disabled>
                                    -- Chọn sự kiện --
                                </MenuItem>
                                {events.map((ev) => (
                                    <MenuItem key={ev.eventId} value={String(ev.eventId)}>
                                        {ev.title}
                                    </MenuItem>
                                ))}
                            </Select>
                            {isLoading ? <Typography color="text.secondary">Đang tải sự kiện...</Typography> : null}
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
                                            label={selectedEvent.publishStatus === "PUBLISHED" ? "Đã phát hành" : "Chưa phát hành"}
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
                                                {(selectedEvent.venueName ?? "Chưa có địa điểm")}, {selectedEvent.city ?? "N/A"}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                                            <GroupIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {estimatedRecipients} lượt vé đã tạo
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        )}

                        <Divider />

                        <TextField
                            fullWidth
                            label="Tiêu đề email"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            disabled={!selectedEventId}
                        />
                        <TextField
                            fullWidth
                            multiline
                            minRows={6}
                            label="Nội dung"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={!selectedEventId}
                        />
                        <Button
                            variant="contained"
                            onClick={() => void handleSend()}
                            disabled={isSending || !selectedEventId || !subject.trim() || !content.trim()}
                            sx={{ width: "fit-content" }}
                        >
                            {isSending ? "Đang gửi..." : "Gửi Email"}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
};

export default OrganizerSendEmailPage;
