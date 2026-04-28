import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
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
import { fetchTicketSalesReport } from "../services/organizer-events.api";
import type { TicketSalesReportData } from "../types/organizer-event.types";

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const OrganizerSalesReportPage = () => {
    const { organizerId, events, error: eventsError } = useOrganizerEvents();
    const [month, setMonth] = useState(String(new Date().getMonth() + 1));
    const [year, setYear] = useState(String(new Date().getFullYear()));
    const [selectedEventId, setSelectedEventId] = useState<string>("ALL");
    const [report, setReport] = useState<TicketSalesReportData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportError, setReportError] = useState<string | null>(null);

    const loadReport = async () => {
        try {
            setIsLoading(true);
            setReportError(null);
            const data = await fetchTicketSalesReport(organizerId, {
                month: Number(month),
                year: Number(year),
            });
            setReport(data);
        } catch (err) {
            setReportError(err instanceof Error ? err.message : "Không tải được báo cáo");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadReport();
    }, [organizerId, month, year]);

    const filteredSummaries = useMemo(() => {
        if (!report) return [];
        if (selectedEventId === "ALL") return report.eventSummaries;
        return report.eventSummaries.filter((s) => String(s.eventId) === selectedEventId);
    }, [report, selectedEventId]);

    const aggregated = useMemo(() => {
        return filteredSummaries.reduce(
            (acc, s) => ({
                ticketsSold: acc.ticketsSold + s.ticketsSold,
                paidOrders: acc.paidOrders + s.paidOrders,
                revenue: acc.revenue + s.revenue,
            }),
            { ticketsSold: 0, paidOrders: 0, revenue: 0 },
        );
    }, [filteredSummaries]);

    return (
        <Stack spacing={2.5}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Báo Cáo Bán Vé
                </Typography>
                <Button variant="outlined" onClick={() => void loadReport()} disabled={isLoading}>
                    Tải lại
                </Button>
            </Stack>

            {eventsError ? <Typography color="error">{eventsError}</Typography> : null}
            {reportError ? <Typography color="error">{reportError}</Typography> : null}

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Select
                        fullWidth
                        size="small"
                        value={selectedEventId}
                        onChange={(e: SelectChangeEvent) => setSelectedEventId(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem value="ALL">Tất cả sự kiện</MenuItem>
                        {events.map((event) => (
                            <MenuItem key={event.eventId} value={String(event.eventId)}>
                                {event.title}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Tháng"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <MenuItem key={m} value={String(m)}>
                                Tháng {m}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Năm"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <MenuItem value="2024">2024</MenuItem>
                        <MenuItem value="2025">2025</MenuItem>
                        <MenuItem value="2026">2026</MenuItem>
                        <MenuItem value="2027">2027</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            {isLoading ? (
                <Typography color="text.secondary">Đang tải báo cáo...</Typography>
            ) : (
                <>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                                <CardContent>
                                    <Typography color="text.secondary">Vé đã bán</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {aggregated.ticketsSold}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                                <CardContent>
                                    <Typography color="text.secondary">Tổng doanh thu</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {formatCurrency(aggregated.revenue)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                                <CardContent>
                                    <Typography color="text.secondary">Đơn hàng đã thanh toán</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                        {aggregated.paidOrders}
                                    </Typography>
                                    {report && selectedEventId === "ALL" ? (
                                        <Typography variant="caption" color="text.secondary">
                                            / {report.totalOrders} đơn tổng
                                        </Typography>
                                    ) : null}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(11,53,88,0.08)" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    Chi tiết theo sự kiện
                                </Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ "& th": { fontWeight: 700, bgcolor: "rgba(11,53,88,0.04)" } }}>
                                            <TableCell>#</TableCell>
                                            <TableCell>Sự kiện</TableCell>
                                            <TableCell align="center">Vé đã bán</TableCell>
                                            <TableCell align="center">Đơn đã TT</TableCell>
                                            <TableCell align="right">Doanh thu</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredSummaries.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                                    Không có dữ liệu bán vé trong tháng {month}/{year}.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredSummaries.map((s, idx) => (
                                                <TableRow key={s.eventId} hover>
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell>{s.eventTitle}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={s.ticketsSold} size="small" color="primary" variant="outlined" />
                                                    </TableCell>
                                                    <TableCell align="center">{s.paidOrders}</TableCell>
                                                    <TableCell align="right">{formatCurrency(s.revenue)}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    <Typography variant="body2" color="text.secondary">
                        Dữ liệu tháng {month}/{year}
                        {selectedEventId !== "ALL"
                            ? ` — ${events.find((e) => String(e.eventId) === selectedEventId)?.title ?? ""}`
                            : " — tổng hợp tất cả sự kiện"}
                    </Typography>
                </>
            )}
        </Stack>
    );
};

export default OrganizerSalesReportPage;
