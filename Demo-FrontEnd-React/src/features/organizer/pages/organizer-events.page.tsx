import { Add, DeleteOutlined, Search as SearchIcon } from "@mui/icons-material";
import {
  Alert,
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
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useOrganizerEvents } from "../context/organizer-events.context";
import {
  fetchCategories,
  updateOrganizerEvent,
} from "../services/organizer-events.api";
import type { CategoryItem, OrganizerEvent } from "../types/organizer-event.types";

type EventFilter =
  | "ALL"
  | "UPCOMING"
  | "PAST"
  | "PUBLISHED"
  | "UNPUBLISHED"
  | "PENDING"
  | "DRAFT";

type TicketTypeDraft = {
  ticketTypeId?: number;
  ticketName: string;
  description: string;
  price: number;
  quantityTotal: number;
  maxPerOrder: number;
  saleStartTime: string;
  saleEndTime: string;
};

type EventDraft = {
  eventId: number;
  categoryId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  city: string;
  venueName: string;
  venueAddress: string;
  locationType: string;
  meetingUrl: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  approvalStatus: string;
  publishStatus: string;
  bannerUrl: string | null;
  bannerFile: File | null;
  ticketTypes: TicketTypeDraft[];
};

const EMPTY_TICKET: TicketTypeDraft = {
  ticketName: "",
  description: "",
  price: 0,
  quantityTotal: 0,
  maxPerOrder: 1,
  saleStartTime: "",
  saleEndTime: "",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const toInputDateTime = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.length >= 16 ? value.slice(0, 16) : value;
  }
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const normalizeDateTime = (value: string): string => {
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value;
};

const getPublishLabel = (event: OrganizerEvent) =>
  event.publishStatus === "PUBLISHED" ? "PUBLISHED" : "UNPUBLISHED";

const getIsPublished = (event: OrganizerEvent) => event.publishStatus === "PUBLISHED";

const getEstimatedAttendees = (event: OrganizerEvent) =>
  event.ticketTypes.reduce((sum, ticket) => sum + ticket.quantityTotal, 0);

const toDraft = (event: OrganizerEvent): EventDraft => ({
  eventId: event.eventId,
  categoryId: event.category ? String(event.category.categoryId) : "",
  title: event.title,
  slug: event.slug,
  shortDescription: event.shortDescription ?? "",
  description: event.description ?? "",
  city: event.city ?? "",
  venueName: event.venueName ?? "",
  venueAddress: event.venueAddress ?? "",
  locationType: event.locationType ?? "OFFLINE",
  meetingUrl: event.meetingUrl ?? "",
  startTime: toInputDateTime(event.startTime),
  endTime: toInputDateTime(event.endTime),
  registrationDeadline: toInputDateTime(event.registrationDeadline),
  approvalStatus: event.approvalStatus,
  publishStatus: event.publishStatus,
  bannerUrl: event.bannerUrl,
  bannerFile: null,
  ticketTypes:
    event.ticketTypes.length > 0
      ? event.ticketTypes.map((ticket) => ({
          ticketTypeId: ticket.ticketTypeId,
          ticketName: ticket.ticketName,
          description: ticket.description ?? "",
          price: Number(ticket.price),
          quantityTotal: ticket.quantityTotal,
          maxPerOrder: ticket.maxPerOrder,
          saleStartTime: toInputDateTime(ticket.saleStartTime),
          saleEndTime: toInputDateTime(ticket.saleEndTime),
        }))
      : [{ ...EMPTY_TICKET }],
});

const OrganizerEventPage = () => {
  const { organizerId, events, isLoading, error, refreshEvents, togglePublishStatus } = useOrganizerEvents();
  const [keyword, setKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState<EventFilter>("ALL");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [draftEvent, setDraftEvent] = useState<EventDraft | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [emailEventId, setEmailEventId] = useState<number | null>(null);
  const [emailTitle, setEmailTitle] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const now = new Date();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const items = await fetchCategories();
        setCategories(items);
      } catch {
        setCategories([]);
      }
    };

    void loadCategories();
  }, []);

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

  const bannerPreview = useMemo(() => {
    if (!draftEvent?.bannerFile) return null;
    return URL.createObjectURL(draftEvent.bannerFile);
  }, [draftEvent?.bannerFile]);

  useEffect(() => {
    return () => {
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const openEventDialog = (event: OrganizerEvent) => {
    setSelectedEventId(event.eventId);
    setDraftEvent(toDraft(event));
    setEditError(null);
    setIsEditMode(false);
  };

  const closeEventDialog = () => {
    setSelectedEventId(null);
    setDraftEvent(null);
    setEditError(null);
    setIsEditMode(false);
  };

  const startEditEvent = () => {
    if (!selectedEvent) return;
    setDraftEvent(toDraft(selectedEvent));
    setEditError(null);
    setIsEditMode(true);
  };

  const cancelEditEvent = () => {
    if (!selectedEvent) return;
    setDraftEvent(toDraft(selectedEvent));
    setEditError(null);
    setIsEditMode(false);
  };

  const updateDraftField = <K extends keyof EventDraft>(key: K, value: EventDraft[K]) => {
    setDraftEvent((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  const updateTicketField = (index: number, key: keyof TicketTypeDraft, value: string) => {
    setDraftEvent((prev) => {
      if (!prev) return prev;
      const nextTickets = [...prev.ticketTypes];
      if (key === "price" || key === "quantityTotal" || key === "maxPerOrder") {
        nextTickets[index][key] = Number(value) as never;
      } else {
        nextTickets[index][key] = value as never;
      }
      return { ...prev, ticketTypes: nextTickets };
    });
  };

  const addTicketType = () => {
    setDraftEvent((prev) => {
      if (!prev) return prev;
      return { ...prev, ticketTypes: [...prev.ticketTypes, { ...EMPTY_TICKET }] };
    });
  };

  const removeTicketType = (index: number) => {
    setDraftEvent((prev) => {
      if (!prev) return prev;
      if (prev.ticketTypes.length === 1) return prev;
      return { ...prev, ticketTypes: prev.ticketTypes.filter((_, i) => i !== index) };
    });
  };

  const canSaveDraft = useMemo(() => {
    if (!draftEvent) return false;
    if (!draftEvent.categoryId || !draftEvent.title || !draftEvent.slug || !draftEvent.shortDescription || !draftEvent.description) {
      return false;
    }
    if (!draftEvent.startTime || !draftEvent.endTime) return false;
    if (draftEvent.locationType !== "ONLINE" && (!draftEvent.venueName || !draftEvent.venueAddress || !draftEvent.city)) {
      return false;
    }

    if (draftEvent.ticketTypes.length === 0) return false;

    return draftEvent.ticketTypes.every(
      (ticket) =>
        ticket.ticketName.trim() &&
        ticket.description.trim() &&
        ticket.price > 0 &&
        ticket.quantityTotal > 0 &&
        ticket.maxPerOrder > 0 &&
        ticket.saleStartTime &&
        ticket.saleEndTime,
    );
  }, [draftEvent]);

  const saveEventChanges = async () => {
    if (!draftEvent || !canSaveDraft) return;

    try {
      setIsSavingEdit(true);
      setEditError(null);

      await updateOrganizerEvent(organizerId, draftEvent.eventId, {
        categoryId: Number(draftEvent.categoryId),
        title: draftEvent.title,
        slug: draftEvent.slug,
        shortDescription: draftEvent.shortDescription,
        description: draftEvent.description,
        venueName: draftEvent.locationType === "ONLINE" ? "" : draftEvent.venueName,
        venueAddress: draftEvent.locationType === "ONLINE" ? "" : draftEvent.venueAddress,
        city: draftEvent.locationType === "ONLINE" ? "" : draftEvent.city,
        locationType: draftEvent.locationType,
        meetingUrl: draftEvent.meetingUrl.trim() || null,
        startTime: normalizeDateTime(draftEvent.startTime),
        endTime: normalizeDateTime(draftEvent.endTime),
        registrationDeadline: draftEvent.registrationDeadline
          ? normalizeDateTime(draftEvent.registrationDeadline)
          : null,
        publishStatus: draftEvent.publishStatus,
        approvalStatus: draftEvent.approvalStatus,
        banner: draftEvent.bannerFile,
        ticketTypes: draftEvent.ticketTypes.map((ticket) => ({
          ticketTypeId: ticket.ticketTypeId,
          ticketName: ticket.ticketName,
          description: ticket.description,
          price: ticket.price,
          quantityTotal: ticket.quantityTotal,
          maxPerOrder: ticket.maxPerOrder,
          saleStartTime: normalizeDateTime(ticket.saleStartTime),
          saleEndTime: normalizeDateTime(ticket.saleEndTime),
        })),
      });

      await refreshEvents();
      setIsEditMode(false);
      closeEventDialog();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Không thể lưu thay đổi sự kiện.");
    } finally {
      setIsSavingEdit(false);
    }
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
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ flex: 1 }}>
                <Box
                  component="img"
                  src={event.bannerUrl || "https://placehold.co/320x180?text=No+Banner"}
                  alt={event.title}
                  sx={{
                    width: { xs: "100%", md: 180 },
                    height: { xs: 160, md: 110 },
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid rgba(11, 53, 88, 0.15)",
                    flexShrink: 0,
                  }}
                />
                <Stack spacing={1}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.shortDescription || "Không có mô tả ngắn"}
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

      {!isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Hiển thị {filteredEvents.length} / {events.length} sự kiện
        </Typography>
      ) : null}

      <Dialog open={Boolean(selectedEventId && draftEvent)} onClose={closeEventDialog} fullWidth maxWidth="md">
        <DialogTitle>Thông tin sự kiện</DialogTitle>
        <DialogContent dividers>
          {draftEvent ? (
            <Stack spacing={2} sx={{ pt: 1 }}>
              {editError ? <Alert severity="error">{editError}</Alert> : null}

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    select
                    label="Loại sự kiện"
                    value={draftEvent.categoryId}
                    onChange={(e) => updateDraftField("categoryId", e.target.value)}
                    disabled={!isEditMode}
                    fullWidth
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.categoryId} value={String(category.categoryId)}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    label="Tên sự kiện"
                    value={draftEvent.title}
                    onChange={(e) => updateDraftField("title", e.target.value)}
                    disabled={!isEditMode}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Slug"
                    value={draftEvent.slug}
                    onChange={(e) => updateDraftField("slug", slugify(e.target.value))}
                    disabled={!isEditMode}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    label="Hình thức"
                    value={draftEvent.locationType}
                    onChange={(e) => updateDraftField("locationType", e.target.value)}
                    disabled={!isEditMode}
                    fullWidth
                  >
                    <MenuItem value="OFFLINE">Offline</MenuItem>
                    <MenuItem value="ONLINE">Online</MenuItem>
                    <MenuItem value="HYBRID">Hybrid</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack spacing={1}>
                    <Button variant="outlined" component="label" disabled={!isEditMode || isSavingEdit}>
                      Upload banner
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          updateDraftField("bannerFile", e.target.files?.[0] ?? null)
                        }
                      />
                    </Button>
                    <Box
                      component="img"
                      src={bannerPreview || draftEvent.bannerUrl || "https://placehold.co/640x360?text=No+Banner"}
                      alt="Event banner"
                      sx={{
                        width: "100%",
                        maxWidth: 480,
                        height: 220,
                        objectFit: "cover",
                        borderRadius: 2,
                        border: "1px solid rgba(11, 53, 88, 0.15)",
                      }}
                    />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Mô tả ngắn"
                    value={draftEvent.shortDescription}
                    onChange={(e) => updateDraftField("shortDescription", e.target.value)}
                    disabled={!isEditMode}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Meeting URL"
                    value={draftEvent.meetingUrl}
                    onChange={(e) => updateDraftField("meetingUrl", e.target.value)}
                    disabled={!isEditMode}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Mô tả chi tiết"
                    value={draftEvent.description}
                    onChange={(e) => updateDraftField("description", e.target.value)}
                    disabled={!isEditMode}
                    multiline
                    minRows={3}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Tên địa điểm"
                    value={draftEvent.venueName}
                    onChange={(e) => updateDraftField("venueName", e.target.value)}
                    disabled={!isEditMode || draftEvent.locationType === "ONLINE"}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Địa chỉ"
                    value={draftEvent.venueAddress}
                    onChange={(e) => updateDraftField("venueAddress", e.target.value)}
                    disabled={!isEditMode || draftEvent.locationType === "ONLINE"}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Thành phố"
                    value={draftEvent.city}
                    onChange={(e) => updateDraftField("city", e.target.value)}
                    disabled={!isEditMode || draftEvent.locationType === "ONLINE"}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Bắt đầu"
                    type="datetime-local"
                    value={draftEvent.startTime}
                    onChange={(e) => updateDraftField("startTime", e.target.value)}
                    disabled={!isEditMode}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Kết thúc"
                    type="datetime-local"
                    value={draftEvent.endTime}
                    onChange={(e) => updateDraftField("endTime", e.target.value)}
                    disabled={!isEditMode}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Hạn đăng ký"
                    type="datetime-local"
                    value={draftEvent.registrationDeadline}
                    onChange={(e) => updateDraftField("registrationDeadline", e.target.value)}
                    disabled={!isEditMode}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                    <MenuItem value="REJECTED">Từ chối</MenuItem>
                    <MenuItem value="DRAFT">Bản nháp</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                </Grid>
              </Grid>

              <Box sx={{ height: 1, bgcolor: "rgba(11,53,88,0.12)" }} />

              <Stack spacing={2}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Ticket types
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addTicketType}
                    disabled={!isEditMode || isSavingEdit}
                  >
                    Thêm loại vé
                  </Button>
                </Stack>

                {draftEvent.ticketTypes.map((ticket, index) => (
                  <Card key={`edit-ticket-${index}`} variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Loại vé #{index + 1}
                          </Typography>
                          <IconButton
                            color="error"
                            onClick={() => removeTicketType(index)}
                            disabled={!isEditMode || isSavingEdit || draftEvent.ticketTypes.length === 1}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Stack>

                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                              fullWidth
                              label="Tên loại vé"
                              value={ticket.ticketName}
                              onChange={(e) => updateTicketField(index, "ticketName", e.target.value)}
                              disabled={!isEditMode}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Giá"
                              value={ticket.price}
                              onChange={(e) => updateTicketField(index, "price", e.target.value)}
                              disabled={!isEditMode}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Tổng số lượng"
                              value={ticket.quantityTotal}
                              onChange={(e) => updateTicketField(index, "quantityTotal", e.target.value)}
                              disabled={!isEditMode}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Tối đa mua mỗi đơn"
                              value={ticket.maxPerOrder}
                              onChange={(e) => updateTicketField(index, "maxPerOrder", e.target.value)}
                              disabled={!isEditMode}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              label="Mô tả vé"
                              value={ticket.description}
                              onChange={(e) => updateTicketField(index, "description", e.target.value)}
                              disabled={!isEditMode}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              type="datetime-local"
                              label="Mở bán"
                              slotProps={{ inputLabel: { shrink: true } }}
                              value={ticket.saleStartTime}
                              onChange={(e) => updateTicketField(index, "saleStartTime", e.target.value)}
                              disabled={!isEditMode}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                              fullWidth
                              type="datetime-local"
                              label="Kết thúc bán"
                              slotProps={{ inputLabel: { shrink: true } }}
                              value={ticket.saleEndTime}
                              onChange={(e) => updateTicketField(index, "saleEndTime", e.target.value)}
                              disabled={!isEditMode}
                            />
                          </Grid>
                        </Grid>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
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
              <Button variant="contained" onClick={() => void saveEventChanges()} disabled={isSavingEdit || !canSaveDraft}>
                {isSavingEdit ? "Đang lưu..." : "Lưu"}
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

      <Dialog open={Boolean(emailEvent)} onClose={closeEmailDialog} fullWidth maxWidth="sm">
        <DialogTitle>Gửi email sự kiện</DialogTitle>
        <DialogContent dividers>
          {emailEvent ? (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField label="Tên sự kiện" value={emailEvent.title} disabled fullWidth />
              <TextField
                label="Thời gian sự kiện"
                value={new Date(emailEvent.startTime).toLocaleString("vi-VN")}
                disabled
                fullWidth
              />
              <TextField label="Số lượng vé" value={getEstimatedAttendees(emailEvent)} disabled fullWidth />
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
          <Button variant="contained" onClick={sendEmail} disabled={!emailTitle.trim() || !emailMessage.trim()}>
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
