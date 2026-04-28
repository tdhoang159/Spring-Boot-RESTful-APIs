import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useOrganizerEvents } from "../context/organizer-events.context";
import { scanTicket, checkInTicket } from "../services/organizer-events.api";
import type { TicketCheckinInfo } from "../types/organizer-event.types";

type CameraOption = {
    id: string;
    label: string;
};

const STATUS_COLOR: Record<string, "success" | "default" | "warning" | "error"> = {
    VALID: "success",
    USED: "default",
    CANCELLED: "error",
    EXPIRED: "warning",
};

const STATUS_LABEL: Record<string, string> = {
    VALID: "Hợp lệ",
    USED: "Đã sử dụng",
    CANCELLED: "Đã huỷ",
    EXPIRED: "Hết hạn",
};

const formatDT = (dt: string | null) => {
    if (!dt) return "—";
    return new Date(dt).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const QR_SCANNER_ID = "organizer-qr-scanner-region";

const OrganizerCheckinPage = () => {
    const { organizerId, events } = useOrganizerEvents();

    // Filter by event (optional)
    const [filterEventId, setFilterEventId] = useState<string>("ALL");

    // Manual input
    const [manualCode, setManualCode] = useState("");

    // Camera scanner
    const [isScannerActive, setIsScannerActive] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [cameraOptions, setCameraOptions] = useState<CameraOption[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string>("");

    // Scan state
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);

    // Dialog
    const [ticketInfo, setTicketInfo] = useState<TicketCheckinInfo | null>(null);
    const [gateName, setGateName] = useState("");
    const [note, setNote] = useState("");
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [checkinError, setCheckinError] = useState<string | null>(null);
    const [checkinSuccess, setCheckinSuccess] = useState<TicketCheckinInfo | null>(null);

    const stopScannerSafely = async (shouldUpdateState = true) => {
        const scanner = scannerRef.current;
        if (!scanner) {
            if (shouldUpdateState) {
                setIsScannerActive(false);
            }
            return;
        }

        try {
            await scanner.stop();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (!message.includes("scanner is not running or paused")) {
                throw error;
            }
        } finally {
            if (shouldUpdateState) {
                setIsScannerActive(false);
            }
        }
    };

    const resetScannerInstance = async (shouldUpdateState = true) => {
        const scanner = scannerRef.current;
        if (!scanner) {
            if (shouldUpdateState) {
                setIsScannerActive(false);
            }
            return;
        }

        try {
            await stopScannerSafely(shouldUpdateState);
        } finally {
            try {
                scanner.clear();
            } catch {
                // Ignore clear failures when the container has already been reset.
            }
            scannerRef.current = null;
        }
    };

    const loadCameras = async () => {
        const cameras = await Html5Qrcode.getCameras();
        const options = cameras.map((camera, index) => ({
            id: camera.id,
            label: camera.label || `Camera ${index + 1}`,
        }));

        setCameraOptions(options);

        if (!options.length) {
            setSelectedCameraId("");
            return [];
        }

        setSelectedCameraId((current) => {
            if (current && options.some((camera) => camera.id === current)) {
                return current;
            }

            const preferredCamera =
                options.find((camera) => /back|rear|environment|tr[uo]c sau/i.test(camera.label))
                ?? options[0];

            return preferredCamera.id;
        });

        return options;
    };

    // Stop camera on unmount
    useEffect(() => {
        return () => {
            void resetScannerInstance(false).catch(() => undefined);
        };
    }, []);

    const doScan = async (code: string) => {
        const trimmed = code.trim();
        if (!trimmed) return;
        try {
            setIsScanning(true);
            setScanError(null);
            const eventId = filterEventId === "ALL" ? undefined : Number(filterEventId);
            const info = await scanTicket(organizerId, trimmed, eventId);
            setTicketInfo(info);
            setGateName("");
            setNote("");
            setCheckinError(null);
            setCheckinSuccess(null);
        } catch (err) {
            setScanError(err instanceof Error ? err.message : "Không tìm thấy vé.");
        } finally {
            setIsScanning(false);
        }
    };

    const startCamera = async () => {
        if (isScannerActive) return;
        setScanError(null);
        try {
            const availableCameras = cameraOptions.length ? cameraOptions : await loadCameras();
            const cameraId = selectedCameraId
                || availableCameras.find((camera) => /back|rear|environment|tr[uo]c sau/i.test(camera.label))?.id
                || availableCameras[0]?.id;

            if (!cameraId) {
                setScanError("Không tìm thấy camera khả dụng trên thiết bị này.");
                setIsScannerActive(false);
                return;
            }

            await resetScannerInstance(false).catch(() => undefined);

            const previewStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: cameraId } },
                audio: false,
            });
            previewStream.getTracks().forEach((track) => track.stop());

            const qr = new Html5Qrcode(QR_SCANNER_ID);
            scannerRef.current = qr;
            await qr.start(
                { deviceId: { exact: cameraId } },
                {
                    fps: 10,
                    qrbox: { width: 220, height: 220 },
                    aspectRatio: 1.3333333,
                    disableFlip: false,
                },
                (decodedText) => {
                    // Stop camera after first successful scan
                    void resetScannerInstance().then(() => {
                        void doScan(decodedText);
                    }).catch(() => undefined);
                },
                () => undefined, // ignore per-frame errors
            );
            setIsScannerActive(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : "";
            if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("denied")) {
                setScanError("Trình duyệt chưa được cấp quyền camera. Hãy cho phép camera rồi bật lại.");
            } else {
                setScanError("Không thể mở camera. Thử chọn camera khác hoặc dùng chức năng quét từ ảnh QR.");
            }
            setIsScannerActive(false);
        }
    };

    useEffect(() => {
        void loadCameras().catch(() => {
            setScanError("Không thể tải danh sách camera. Vui lòng kiểm tra quyền truy cập camera.");
        });
    }, []);

    const stopCamera = () => {
        void resetScannerInstance().catch(() => undefined);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        try {
            setIsScanning(true);
            setScanError(null);
            await resetScannerInstance(false).catch(() => undefined);

            const scanner = new Html5Qrcode(QR_SCANNER_ID);
            scannerRef.current = scanner;
            const decodedText = await scanner.scanFile(file, true);
            scanner.clear();
            scannerRef.current = null;
            await doScan(decodedText);
        } catch (error) {
            setScanError(error instanceof Error ? error.message : "Không đọc được mã QR từ ảnh đã chọn.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleManualSearch = () => {
        void doScan(manualCode);
    };

    const handleCheckin = async () => {
        if (!ticketInfo) return;
        try {
            setIsCheckingIn(true);
            setCheckinError(null);
            const eventId = filterEventId === "ALL" ? ticketInfo.eventId : Number(filterEventId);
            const result = await checkInTicket(organizerId, {
                ticketCode: ticketInfo.ticketCode,
                eventId,
                gateName: gateName.trim() || undefined,
                note: note.trim() || undefined,
            });
            setCheckinSuccess(result);
            setTicketInfo(result);
        } catch (err) {
            setCheckinError(err instanceof Error ? err.message : "Check-in thất bại.");
        } finally {
            setIsCheckingIn(false);
        }
    };

    const closeDialog = () => {
        setTicketInfo(null);
        setCheckinSuccess(null);
        setCheckinError(null);
        setGateName("");
        setNote("");
        setManualCode("");
        void startCamera();
    };

    const canCheckin = ticketInfo?.status === "VALID" && !checkinSuccess;

    return (
        <Stack spacing={3}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Quét Vé / Check-in
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
                Chọn camera rồi bật quét. Nếu webcam không hiển thị hình, bạn vẫn có thể quét trực tiếp từ ảnh QR.
            </Typography>

            {/* Event filter */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                    Lọc theo sự kiện:
                </Typography>
                <Select
                    size="small"
                    value={filterEventId}
                    onChange={(e: SelectChangeEvent) => setFilterEventId(e.target.value)}
                    sx={{ minWidth: 280 }}
                    displayEmpty
                >
                    <MenuItem value="ALL">Tất cả sự kiện</MenuItem>
                    {events.map((ev) => (
                        <MenuItem key={ev.eventId} value={String(ev.eventId)}>
                            {ev.title}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            {/* Manual input */}
            <Stack direction="row" spacing={1}>
                <TextField
                    label="Nhập mã vé thủ công"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") void doScan(manualCode);
                    }}
                    size="small"
                    sx={{ flex: 1, maxWidth: 480 }}
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
                <Button
                    variant="contained"
                    onClick={handleManualSearch}
                    disabled={isScanning || !manualCode.trim()}
                >
                    {isScanning ? "Đang tra..." : "Tra vé"}
                </Button>
            </Stack>

            {/* Camera controls */}
            <Stack direction="row" spacing={1}>
                <Select
                    size="small"
                    value={selectedCameraId}
                    onChange={(e: SelectChangeEvent) => setSelectedCameraId(e.target.value)}
                    sx={{ minWidth: 280 }}
                    displayEmpty
                    disabled={isScannerActive || cameraOptions.length === 0}
                >
                    <MenuItem value="" disabled>
                        {cameraOptions.length === 0 ? "Không có camera" : "Chọn camera"}
                    </MenuItem>
                    {cameraOptions.map((camera) => (
                        <MenuItem key={camera.id} value={camera.id}>
                            {camera.label}
                        </MenuItem>
                    ))}
                </Select>
                {!isScannerActive ? (
                    <Button
                        variant="outlined"
                        startIcon={<QrCodeScannerIcon />}
                        onClick={() => void startCamera()}
                    >
                        Bật camera
                    </Button>
                ) : null}
                {isScannerActive ? (
                    <Button variant="outlined" color="error" onClick={stopCamera}>
                        Tạm dừng camera
                    </Button>
                ) : null}
                <Button
                    variant="outlined"
                    startIcon={<ImageSearchIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                >
                    Quét từ ảnh
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => void handleImageUpload(e)}
                />
            </Stack>

            {/* QR scanner viewport */}
            <Box
                id={QR_SCANNER_ID}
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    minHeight: 300,
                    display: "block",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "2px solid rgba(11,53,88,0.2)",
                    bgcolor: "rgba(11,53,88,0.03)",
                }}
            />

            {!isScannerActive ? (
                <Typography variant="body2" color="text.secondary">
                    Camera đang tạm dừng. Nhấn "Bật camera" để tiếp tục quét.
                </Typography>
            ) : null}

            {scanError ? <Alert severity="error">{scanError}</Alert> : null}
            {isScanning ? <Typography color="text.secondary">Đang tra cứu vé...</Typography> : null}

            {/* Ticket info dialog */}
            <Dialog open={Boolean(ticketInfo)} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Thông tin vé
                        </Typography>
                        {ticketInfo ? (
                            <Chip
                                label={STATUS_LABEL[ticketInfo.status] ?? ticketInfo.status}
                                color={STATUS_COLOR[ticketInfo.status] ?? "default"}
                                size="small"
                            />
                        ) : null}
                    </Stack>
                </DialogTitle>

                <DialogContent dividers>
                    {ticketInfo ? (
                        <Stack spacing={2}>
                            {checkinSuccess ? (
                                <Alert
                                    severity="success"
                                    icon={<CheckCircleIcon />}
                                >
                                    Check-in thành công! Vé đã được đánh dấu <strong>Đã sử dụng</strong>.
                                </Alert>
                            ) : null}
                            {checkinError ? <Alert severity="error">{checkinError}</Alert> : null}

                            {/* Ticket details */}
                            <Box
                                sx={{
                                    bgcolor: "rgba(11,53,88,0.04)",
                                    borderRadius: 2,
                                    border: "1px solid rgba(11,53,88,0.1)",
                                    p: 2,
                                }}
                            >
                                <Stack spacing={1.5}>
                                    <InfoRow label="Mã vé" value={<code style={{ fontSize: 13 }}>{ticketInfo.ticketCode}</code>} />
                                    <InfoRow label="Người tham dự" value={ticketInfo.attendeeName} />
                                    <InfoRow label="Email" value={ticketInfo.attendeeEmail} />
                                    <Divider />
                                    <InfoRow label="Sự kiện" value={ticketInfo.eventTitle} />
                                    <InfoRow label="Loại vé" value={ticketInfo.ticketTypeName} />
                                    <InfoRow label="Cấp lúc" value={formatDT(ticketInfo.issuedAt)} />
                                    {ticketInfo.checkedIn ? (
                                        <InfoRow
                                            label="Check-in lúc"
                                            value={formatDT(ticketInfo.checkedInAt)}
                                        />
                                    ) : null}
                                </Stack>
                            </Box>

                            {/* Check-in form */}
                            {canCheckin ? (
                                <>
                                    <Divider />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        Thông tin check-in
                                    </Typography>
                                    <TextField
                                        label="Cổng vào (tuỳ chọn)"
                                        value={gateName}
                                        onChange={(e) => setGateName(e.target.value)}
                                        fullWidth
                                        size="small"
                                        placeholder="VD: Gate A, Cổng chính..."
                                    />
                                    <TextField
                                        label="Ghi chú (tuỳ chọn)"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        fullWidth
                                        size="small"
                                        multiline
                                        minRows={2}
                                        placeholder="Ghi chú thêm về lần check-in này..."
                                    />
                                </>
                            ) : null}
                        </Stack>
                    ) : null}
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    {canCheckin ? (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => void handleCheckin()}
                            disabled={isCheckingIn}
                        >
                            {isCheckingIn ? "Đang check-in..." : "Xác nhận Check-in"}
                        </Button>
                    ) : null}
                    <Button variant="outlined" onClick={closeDialog}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

// Small helper component for label-value rows
const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0, fontWeight: 500 }}>
            {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
            {value}
        </Typography>
    </Stack>
);

export default OrganizerCheckinPage;
