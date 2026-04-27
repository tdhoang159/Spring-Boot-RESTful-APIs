import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMemo, useState } from "react";
import { Tooltip } from "@mui/material";
import { useOrganizerEvents } from "../context/organizer-events.context";
import type { OrganizerEvent } from "../types/organizer-event.types";

type EventFilter =
  | "ALL"
  | "UPCOMING"
  | "PAST"
  | "PUBLISHED"
  | "UNPUBLISHED"
  | "PENDING"
  | "DRAFT";

type EventDraft = {
  eventId: number;
  title: string;
  shortDescription: string;
  city: string;
  venueName: string;
  startTime: string;
  approvalStatus: string;
  publishStatus: string;
};

const getPublishLabel = (event: OrganizerEvent) =>
  event.publishStatus === "PUBLISHED" ? "PUBLISHED" : "UNPUBLISHED";

const getIsPublished = (event: OrganizerEvent) => event.publishStatus === "PUBLISHED";

const getEstimatedAttendees = (event: OrganizerEvent) =>
  event.ticketTypes.reduce((sum, ticket) => sum + ticket.quantityTotal, 0);

const toDraft = (event: OrganizerEvent): EventDraft => ({
  eventId: event.eventId,
  title: event.title,
  shortDescription: event.shortDescription ?? "",
  city: event.city ?? "",
  venueName: event.venueName ?? "",
  startTime: event.startTime,
  approvalStatus: event.approvalStatus,
  publishStatus: event.publishStatus,
});

const OrganizerEventPage = () => {
  const { events, isLoading, error, refreshEvents, togglePublishStatus } = useOrganizerEvents();
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState<EventFilter>("ALL");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [draftEvent, setDraftEvent] = useState<EventDraft | null>(null);
  const [emailEventId, setEmailEventId] = useState<number | null>(null);
  const [emailTitle, setEmailTitle] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const now = new Date();

  const filterItems: Array<{ label: string; value: EventFilter }> = [
    { label: "Tất cả", value: "ALL" },
    { label: "Sắp tới", value: "UPCOMING" },
    { label: "Đã qua", value: "PAST" },
    { label: "Đã xuất bản", value: "PUBLISHED" },
    { label: "Chưa xuất bản", value: "UNPUBLISHED" },
    { label: "Chờ duyệt", value: "PENDING" },
    { label: "Nháp", value: "DRAFT" },
  ];

  const selectedEvent = useMemo(
    () => events.find((event) => event.eventId === selectedEventId) ?? null,
    [events, selectedEventId],
  );

  const emailEvent = useMemo(
    () => events.find((event) => event.eventId === emailEventId) ?? null,
    [events, emailEventId],
  );

  const openEventDialog = (event: OrganizerEvent) => {
    setSelectedEventId(event.eventId);
    setDraftEvent(toDraft(event));
    setIsEditMode(false);
  };

  const closeEventDialog = () => {
    setSelectedEventId(null);
    setDraftEvent(null);
    setIsEditMode(false);
  };

  const startEditEvent = () => {
    if (!selectedEvent) return;
    setDraftEvent(toDraft(selectedEvent));
    setIsEditMode(true);
  };

  const cancelEditEvent = () => {
    if (!selectedEvent) return;
    setDraftEvent(toDraft(selectedEvent));
    setIsEditMode(false);
  };

  const saveEventChanges = async () => {
    if (!draftEvent) return;

    try {
      setIsSavingEdit(true);
      // Demo flow: refresh from server so UI always reflects latest backend state.
      await refreshEvents();
      setIsEditMode(false);
      alert("Đã tải lại dữ liệu sự kiện mới nhất từ API.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const updateDraftField = <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => {
    setDraftEvent((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  const openEmailDialog = (event: OrganizerEvent) => {
    setEmailEventId(event.eventId);
    setEmailTitle(`[${event.title}] Thông báo cập nhật sự kiện`);
    setEmailMessage("Chào bạn,\n\nCảm ơn bạn đã đăng ký sự kiện. Đây là thông báo mới nhất từ Organizer.");
  };

  const closeEmailDialog = () => {
    setEmailEventId(null);
    setEmailTitle("");
    setEmailMessage("");
  };

  const sendEmail = () => {
    if (!emailEvent) return;

    console.log("Send event email", {
      eventId: emailEvent.eventId,
      eventTitle: emailEvent.title,
      recipients: getEstimatedAttendees(emailEvent),
      title: emailTitle,
      message: emailMessage,
    });
    closeEmailDialog();
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const titleMatched = event.title.toLowerCase().includes(keyword.trim().toLowerCase());
      if (!titleMatched) {
        return false;
      }

      const isUpcoming = new Date(event.startTime) >= now;
      const isPublished = getIsPublished(event);

      if (activeFilter === "ALL") return true;
      if (activeFilter === "UPCOMING") return isUpcoming;
      if (activeFilter === "PAST") return !isUpcoming;
      if (activeFilter === "PUBLISHED") return isPublished;
      if (activeFilter === "UNPUBLISHED") return !isPublished;
      if (activeFilter === "PENDING") return event.approvalStatus === "PENDING";
      if (activeFilter === "DRAFT") return event.approvalStatus === "DRAFT";

      return true;
    });
  }, [events, keyword, activeFilter, now]);

  const getWorkflowChipColor = (status: string) => {
    if (status === "APPROVED") return "success" as const;
    if (status === "PENDING") return "warning" as const;
    return "default" as const;
  };

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Sự kiện của tôi
        </Typography>
        <Button variant="outlined" onClick={() => void refreshEvents()}>
          Tải lại
        </Button>
      </Stack>

      {error ? <Typography color="error">{error}</Typography> : null}

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          placeholder="Tìm kiếm sự kiện"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ width: { xs: "100%", md: 420 } }}
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
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            alignItems: "center",
            border: "1px solid rgba(11, 53, 88, 0.2)",
            borderRadius: 2,
            p: 0.5,
          }}
        >
          {filterItems.map((item) => (
            <Button
              key={item.value}
              size="small"
              variant={activeFilter === item.value ? "contained" : "text"}
              onClick={() => setActiveFilter(item.value)}
              sx={{ borderRadius: 2 }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Stack>

      {isLoading ? <Typography color="text.secondary">Đang tải dữ liệu sự kiện...</Typography> : null}

      {filteredEvents.map((event) => (
        <Card
          key={event.eventId}
          elevation={0}
          onClick={() => openEventDialog(event)}
          sx={{
            borderRadius: 4,
            border: "1px solid rgba(11, 53, 88, 0.12)",
            cursor: "pointer",
            transition: "transform 150ms ease, box-shadow 150ms ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 22px rgba(11, 53, 88, 0.12)",
            },
          }}
        >
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              sx={{ justifyContent: "space-between", alignItems: { md: "center" } }}
            >
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {event.title}
                </Typography>
                <Chip
                  size="small"
                  label={getPublishLabel(event)}
                  color={getIsPublished(event) ? "success" : "default"}
                  sx={{ width: "fit-content" }}
                />
                <Stack direction="row" spacing={1}>
                  <Chip
                    size="small"
                    label={event.approvalStatus}
                    color={getWorkflowChipColor(event.approvalStatus)}
                    sx={{ width: "fit-content" }}
                  />
                  <Chip
                    size="small"
                    label={new Date(event.startTime) >= now ? "SAP_TOI" : "DA_QUA"}
                    sx={{ width: "fit-content" }}
                  />
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Button
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEmailDialog(event);
                  }}
                >
                  Gửi email
                </Button>
                <Tooltip
                  title={
                    event.approvalStatus !== "APPROVED"
                      ? "Chỉ có thể publish/unpublish khi sự kiện đã được duyệt (APPROVED)"
                      : ""
                  }
                  placement="top"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={getIsPublished(event)}
                          onChange={() => void togglePublishStatus(event)}
                          disabled={event.approvalStatus !== "APPROVED"}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          color={event.approvalStatus !== "APPROVED" ? "text.disabled" : "text.primary"}
                        >
                          {getIsPublished(event) ? "Unpublish" : "Publish"}
                        </Typography>
                      }
                    />
                  </span>
                </Tooltip>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}

      {filteredEvents.length === 0 ? (
        <Box sx={{ p: 3, border: "1px dashed rgba(11, 53, 88, 0.25)", borderRadius: 3 }}>
          <Typography color="text.secondary">Không tìm thấy sự kiện phù hợp bộ lọc.</Typography>
        </Box>
      ) : null}

      <Dialog
        open={Boolean(selectedEventId && draftEvent)}
        onClose={closeEventDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Thông tin sự kiện</DialogTitle>
        <DialogContent dividers>
          {draftEvent ? (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Tên sự kiện"
                value={draftEvent.title}
                onChange={(e) => updateDraftField("title", e.target.value)}
                disabled={!isEditMode}
                fullWidth
              />
              <TextField
                label="Mô tả ngắn"
                value={draftEvent.shortDescription}
                onChange={(e) => updateDraftField("shortDescription", e.target.value)}
                disabled={!isEditMode}
                multiline
                minRows={3}
                fullWidth
              />
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <TextField
                  label="Thành phố"
                  value={draftEvent.city}
                  onChange={(e) => updateDraftField("city", e.target.value)}
                  disabled={!isEditMode}
                  fullWidth
                />
                <TextField
                  label="Địa điểm"
                  value={draftEvent.venueName}
                  onChange={(e) => updateDraftField("venueName", e.target.value)}
                  disabled={!isEditMode}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Thời gian bắt đầu"
                type="datetime-local"
                value={draftEvent.startTime}
                onChange={(e) => updateDraftField("startTime", e.target.value)}
                disabled={!isEditMode}
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
              />
              <TextField
                select
                label="Trạng thái duyệt"
                value={draftEvent.approvalStatus}
                onChange={(e) => updateDraftField("approvalStatus", e.target.value)}
                disabled={!isEditMode}
                fullWidth
              >
                <MenuItem value="APPROVED">Đã duyệt</MenuItem>
                <MenuItem value="PENDING">Đang chờ</MenuItem>
                <MenuItem value="DRAFT">Bản nháp</MenuItem>
              </TextField>
              <FormControlLabel
                control={
                  <Switch
                    checked={draftEvent.publishStatus === "PUBLISHED"}
                    onChange={(e) =>
                      updateDraftField("publishStatus", e.target.checked ? "PUBLISHED" : "UNPUBLISHED")
                    }
                    disabled={!isEditMode}
                  />
                }
                label={draftEvent.publishStatus === "PUBLISHED" ? "Đang publish" : "Đang unpublish"}
              />
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {!isEditMode ? (
            <>
              <Button variant="contained" onClick={startEditEvent}>
                Chỉnh sửa
              </Button>
              <Button variant="outlined" onClick={closeEventDialog}>
                Đóng
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" onClick={() => void saveEventChanges()} disabled={isSavingEdit}>
                {isSavingEdit ? "Đang tải lại..." : "Lưu"}
              </Button>
              <Button variant="outlined" onClick={cancelEditEvent} disabled={isSavingEdit}>
                Hủy
              </Button>
              <Button variant="text" onClick={closeEventDialog} disabled={isSavingEdit}>
                Đóng
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(emailEvent)}
        onClose={closeEmailDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Gửi email sự kiện</DialogTitle>
        <DialogContent dividers>
          {emailEvent ? (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Tên sự kiện"
                value={emailEvent.title}
                disabled
                fullWidth
              />
              <TextField
                label="Thời gian sự kiện"
                value={new Date(emailEvent.startTime).toLocaleString("vi-VN")}
                disabled
                fullWidth
              />
              <TextField
                label="Số lượng vé"
                value={getEstimatedAttendees(emailEvent)}
                disabled
                fullWidth
              />
              <Typography color="text.secondary">
                Số người sẽ nhận mail: {getEstimatedAttendees(emailEvent)}
              </Typography>
              <TextField
                label="Tiêu đề email"
                value={emailTitle}
                onChange={(e) => setEmailTitle(e.target.value)}
                fullWidth
              />
              <TextField
                label="Nội dung"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                multiline
                minRows={5}
                fullWidth
              />
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="contained"
            onClick={sendEmail}
            disabled={!emailTitle.trim() || !emailMessage.trim()}
          >
            Gửi email
          </Button>
          <Button variant="outlined" onClick={closeEmailDialog}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default OrganizerEventPage;
