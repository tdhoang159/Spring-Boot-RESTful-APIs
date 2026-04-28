import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Pagination,
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
import { useEffect, useMemo, useState } from "react";
import { useOrganizerEvents } from "../context/organizer-events.context";
import { fetchOrganizerEmailHistory } from "../services/organizer-events.api";
import type { OrganizerEmailHistoryItem, SpringPage } from "../types/organizer-event.types";

const statusColor: Record<string, "success" | "default" | "warning" | "error"> = {
  SENT: "success",
  SCHEDULED: "warning",
  DRAFT: "default",
  FAILED: "error",
};

const statusLabel: Record<string, string> = {
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
  const { organizerId, events, isLoading, error, refreshEvents } = useOrganizerEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchText, setSearchText] = useState("");
  const [history, setHistory] = useState<OrganizerEmailHistoryItem[]>([]);
  const [historyPage, setHistoryPage] = useState<SpringPage<OrganizerEmailHistoryItem> | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loadEmailHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setHistoryError(null);
      const eventId = selectedEventId === "ALL" ? undefined : Number(selectedEventId);
      const sendStatus = selectedStatus === "ALL" ? undefined : selectedStatus;
      const pageData = await fetchOrganizerEmailHistory(organizerId, {
        eventId,
        sendStatus,
        page: page - 1,
        size: pageSize,
      });
      setHistoryPage(pageData);
      setHistory(pageData.content ?? []);
    } catch (apiError) {
      setHistoryError(apiError instanceof Error ? apiError.message : "Không tải được lịch sử email");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    void loadEmailHistory();
  }, [organizerId, selectedEventId, selectedStatus, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedEventId, selectedStatus]);

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        searchText.trim() === "" ||
        item.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        item.eventTitle.toLowerCase().includes(searchText.toLowerCase());
      return matchSearch;
    });
  }, [history, searchText]);

  const getStatusColor = (status: string): "success" | "default" | "warning" | "error" => {
    return statusColor[status] ?? "default";
  };

  const getStatusLabel = (status: string): string => {
    return statusLabel[status] ?? status;
  };

  const handleReload = async () => {
    await refreshEvents();
    await loadEmailHistory();
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Lịch Sử Email Đã Gửi
        </Typography>
        <Button variant="outlined" onClick={() => void handleReload()}>
          Tải lại
        </Button>
      </Stack>

      {error ? <Typography color="error">{error}</Typography> : null}
      {historyError ? <Typography color="error">{historyError}</Typography> : null}

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

      {isLoading || isLoadingHistory ? <Typography color="text.secondary">Đang tải dữ liệu...</Typography> : null}

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
                    <Chip label={getStatusLabel(item.sendStatus)} color={getStatusColor(item.sendStatus)} size="small" />
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

      {(historyPage?.totalPages ?? 0) > 1 ? (
        <Stack sx={{ alignItems: "center", pt: 1 }}>
          <Pagination
            color="primary"
            page={page}
            count={historyPage?.totalPages ?? 1}
            onChange={(_, value) => setPage(value)}
          />
        </Stack>
      ) : null}

      {!isLoadingHistory && !historyError ? (
        <Typography variant="body2" color="text.secondary">
          Hiển thị {filtered.length} / {historyPage?.totalElements ?? 0} email
        </Typography>
      ) : null}
    </Stack>
  );
};

export default OrganizerEmailHistoryPage;
