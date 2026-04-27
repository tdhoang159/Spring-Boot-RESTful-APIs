import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  InputAdornment,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import { useMemo, useState } from "react";
import { useOrganizerEvents } from "../context/organizer-events.context";

type SendStatus = "DRAFT" | "SENT";

type EmailHistoryItem = {
  campaignId: number;
  eventId: number;
  eventTitle: string;
  subject: string;
  content: string;
  sendStatus: SendStatus;
  sentAt: string | null;
  createdAt: string;
};

const MOCK_HISTORY: EmailHistoryItem[] = [
  {
    campaignId: 1,
    eventId: 1,
    eventTitle: "Tech Meetup 2026",
    subject: "Thong bao: Tech Meetup 2026 sap dien ra!",
    content: "Chao ban, su kien Tech Meetup 2026 se dien ra vao ngay 15/09/2026. Moi ban tham du.",
    sendStatus: "SENT",
    sentAt: "2026-04-10T10:30:00",
    createdAt: "2026-04-10T10:00:00",
  },
  {
    campaignId: 2,
    eventId: 2,
    eventTitle: "Business Summit",
    subject: "Xac nhan tham du Business Summit",
    content: "Cam on ban da dang ky tham du Business Summit. Chung toi rat vui duoc gap ban.",
    sendStatus: "SENT",
    sentAt: "2026-04-15T09:00:00",
    createdAt: "2026-04-14T18:00:00",
  },
  {
    campaignId: 3,
    eventId: 1,
    eventTitle: "Tech Meetup 2026",
    subject: "Cap nhat lich trinh Tech Meetup 2026",
    content: "Lich trinh chi tiet cua Tech Meetup 2026 da duoc cap nhat. Vui long kiem tra trang web.",
    sendStatus: "SENT",
    sentAt: "2026-04-20T14:00:00",
    createdAt: "2026-04-20T13:30:00",
  },
  {
    campaignId: 4,
    eventId: 3,
    eventTitle: "Frontend Workshop",
    subject: "Reminder: Frontend Workshop bat dau vao ngay mai",
    content: "Nhac nho ban rang Frontend Workshop se bat dau vao ngay mai luc 08:30 tai Innovation Hub.",
    sendStatus: "SCHEDULED",
    sentAt: null,
    createdAt: "2026-04-22T11:00:00",
  },
  {
    campaignId: 5,
    eventId: 4,
    eventTitle: "Startup Connect Day",
    subject: "Thong bao mo dang ky Startup Connect Day",
    content: "Startup Connect Day chinh thuc mo dang ky. Dang ky ngay de co mat trong su kien.",
    sendStatus: "SENT",
    sentAt: "2026-04-23T08:00:00",
    createdAt: "2026-04-22T20:00:00",
  },
];

const statusColor: Record<SendStatus, "success" | "default" | "warning" | "error"> = {
  SENT: "success",
  SCHEDULED: "warning",
  DRAFT: "default",
  FAILED: "error",
};

const statusLabel: Record<SendStatus, string> = {
  SENT: "Đã gửi",
  SCHEDULED: "Đã lên lịch",
  DRAFT: "Nháp",
  FAILED: "Thất bại",
};

const formatDateTime = (dt: string | null) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const OrganizerEmailHistoryPage = () => {
  const { events, isLoading, error, refreshEvents } = useOrganizerEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchText, setSearchText] = useState("");

  const history = MOCK_HISTORY;

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchEvent = selectedEventId === "ALL" || item.eventId === Number(selectedEventId);
      const matchStatus = selectedStatus === "ALL" || item.sendStatus === selectedStatus;
      const matchSearch =
        searchText.trim() === "" ||
        item.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        item.eventTitle.toLowerCase().includes(searchText.toLowerCase());
      return matchEvent && matchStatus && matchSearch;
    });
  }, [history, selectedEventId, selectedStatus, searchText]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Lịch Sử Email Đã Gửi
        </Typography>
        <Button variant="outlined" onClick={() => void refreshEvents()}>
          Tải lại sự kiện
        </Button>
      </Stack>

      {error ? <Typography color="error">{error}</Typography> : null}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Tìm kiếm"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Tiêu đề hoặc tên sự kiện..."
          sx={{ minWidth: 300 }}
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

        <Select
          size="small"
          value={selectedEventId}
          onChange={(e: SelectChangeEvent) => setSelectedEventId(e.target.value)}
          sx={{ minWidth: 260 }}
          displayEmpty
        >
          <MenuItem value="ALL">Tất cả sự kiện</MenuItem>
          {events.map((ev) => (
            <MenuItem key={ev.eventId} value={String(ev.eventId)}>
              {ev.title}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={selectedStatus}
          onChange={(e: SelectChangeEvent) => setSelectedStatus(e.target.value)}
          sx={{ minWidth: 160 }}
          displayEmpty
        >
          <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
          <MenuItem value="SENT">Đã gửi</MenuItem>
          <MenuItem value="SCHEDULED">Đã lên lịch</MenuItem>
          <MenuItem value="DRAFT">Nháp</MenuItem>
          <MenuItem value="FAILED">Thất bại</MenuItem>
        </Select>
      </Stack>

      {isLoading ? <Typography color="text.secondary">Đang tải danh sách sự kiện...</Typography> : null}

      <Typography variant="body2" color="text.secondary">
        Hiển thị {filtered.length} / {history.length} email
      </Typography>

      {filtered.length === 0 ? (
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid rgba(11,53,88,0.12)" }}>
          <CardContent>
            <Stack spacing={1} sx={{ py: 4, alignItems: "center" }}>
              <EmailIcon sx={{ fontSize: 48, color: "text.disabled" }} />
              <Typography color="text.secondary">Không có email nào phù hợp.</Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {filtered.map((item) => (
            <Card
              key={item.campaignId}
              elevation={0}
              sx={{ borderRadius: 3, border: "1px solid rgba(11,53,88,0.12)" }}
            >
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {item.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sự kiện: <strong>{item.eventTitle}</strong>
                      </Typography>
                    </Stack>
                    <Chip label={statusLabel[item.sendStatus]} color={statusColor[item.sendStatus]} size="small" />
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.content}
                  </Typography>

                  <Box>
                    <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
                      <Typography variant="caption" color="text.secondary">
                        Tạo lúc: {formatDateTime(item.createdAt)}
                      </Typography>
                      {item.sentAt && (
                        <Typography variant="caption" color="text.secondary">
                          Gửi lúc: {formatDateTime(item.sentAt)}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default OrganizerEmailHistoryPage;
