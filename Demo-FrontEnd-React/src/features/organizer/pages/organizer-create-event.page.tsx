import { Add, DeleteOutlined } from "@mui/icons-material";
import {
    Alert,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useOrganizerEvents } from "../context/organizer-events.context";
import { createOrganizerEvent, fetchCategories } from "../services/organizer-events.api";
import type { CategoryItem } from "../types/organizer-event.types";

type TicketTypeForm = {
    ticketName: string;
    description: string;
    price: number;
    quantityTotal: number;
    maxPerOrder: number;
    saleStartTime: string;
    saleEndTime: string;
};

const EMPTY_TICKET: TicketTypeForm = {
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

const normalizeDateTime = (value: string): string => {
    if (!value) return value;
    return value.length === 16 ? `${value}:00` : value;
};

const OrganizerCreateEventPage = () => {
    const { organizerId, refreshEvents } = useOrganizerEvents();

    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    const [categoryId, setCategoryId] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [venueName, setVenueName] = useState("");
    const [venueAddress, setVenueAddress] = useState("");
    const [city, setCity] = useState("");
    const [locationType, setLocationType] = useState("OFFLINE");
    const [meetingUrl, setMeetingUrl] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [registrationDeadline, setRegistrationDeadline] = useState("");

    const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([
        {
            ticketName: "",
            description: "",
            price: 0,
            quantityTotal: 0,
            maxPerOrder: 0,
            saleStartTime: "",
            saleEndTime: "",
        },
    ]);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoadingCategories(true);
                setCategoriesError(null);
                const items = await fetchCategories();
                setCategories(items);
            } catch (error) {
                setCategoriesError(error instanceof Error ? error.message : "Khong tai duoc categories");
            } finally {
                setIsLoadingCategories(false);
            }
        };

        void loadCategories();
    }, []);

    useEffect(() => {
        setSlug(slugify(title));
    }, [title]);

    const canSave = useMemo(() => {
        if (!categoryId || !title || !slug || !shortDescription || !description) return false;
        if (!startTime || !endTime) return false;
        if (locationType !== "ONLINE" && (!venueName || !venueAddress || !city)) return false;
        if (ticketTypes.length === 0) return false;

        return ticketTypes.every(
            (ticket) =>
                ticket.ticketName.trim() &&
                ticket.description.trim() &&
                ticket.price > 0 &&
                ticket.quantityTotal > 0 &&
                ticket.maxPerOrder > 0 &&
                ticket.saleStartTime &&
                ticket.saleEndTime,
        );
    }, [categoryId, city, description, endTime, locationType, shortDescription, slug, startTime, ticketTypes, title, venueAddress, venueName]);

    const updateTicket = (index: number, key: keyof TicketTypeForm, value: string) => {
        setTicketTypes((prev) => {
            const next = [...prev];
            if (key === "price" || key === "quantityTotal" || key === "maxPerOrder") {
                next[index][key] = Number(value);
            } else {
                next[index][key] = value;
            }
            return next;
        });
    };

    const addTicketType = () => {
        setTicketTypes((prev) => [...prev, { ...EMPTY_TICKET }]);
    };

    const removeTicketType = (index: number) => {
        setTicketTypes((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!canSave) {
            alert("Vui long nhap day du thong tin bat buoc.");
            return;
        }

        const payload = {
            organizerId,
            categoryId: Number(categoryId),
            title,
            slug,
            shortDescription,
            description,
            venueName: locationType === "ONLINE" ? "" : venueName,
            venueAddress: locationType === "ONLINE" ? "" : venueAddress,
            city: locationType === "ONLINE" ? "" : city,
            locationType,
            meetingUrl: meetingUrl.trim() || null,
            startTime: normalizeDateTime(startTime),
            endTime: normalizeDateTime(endTime),
            registrationDeadline: registrationDeadline ? normalizeDateTime(registrationDeadline) : null,
            ticketTypes: ticketTypes.map((ticket) => ({
                ticketName: ticket.ticketName,
                description: ticket.description,
                price: ticket.price,
                quantityTotal: ticket.quantityTotal,
                maxPerOrder: ticket.maxPerOrder,
                saleStartTime: normalizeDateTime(ticket.saleStartTime),
                saleEndTime: normalizeDateTime(ticket.saleEndTime),
            })),
        };

        try {
            setIsSaving(true);
            await createOrganizerEvent(organizerId, payload);
            await refreshEvents();
            alert("Tao su kien thanh cong.");
        } catch (error) {
            console.log("Create Event Payload:", payload);
            alert(error instanceof Error ? error.message : "Khong tao duoc su kien.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Stack spacing={2.5}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Tạo Sự Kiện
            </Typography>

            {categoriesError ? <Alert severity="error">{categoriesError}</Alert> : null}

            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                select
                                fullWidth
                                label="Loại sự kiện"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                disabled={isLoadingCategories}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.categoryId} value={String(category.categoryId)}>
                                        {category.categoryName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField fullWidth label="Tiêu đề sự kiện" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField fullWidth label="Slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                select
                                label="Hình thức"
                                value={locationType}
                                onChange={(e) => setLocationType(e.target.value)}
                            >
                                <MenuItem value="OFFLINE">Offline</MenuItem>
                                <MenuItem value="ONLINE">Online</MenuItem>
                                <MenuItem value="HYBRID">Hybrid</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Mô tả ngắn"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Meeting URL"
                                value={meetingUrl}
                                onChange={(e) => setMeetingUrl(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Mô tả chi tiết"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Tên địa điểm"
                                value={venueName}
                                onChange={(e) => setVenueName(e.target.value)}
                                disabled={locationType === "ONLINE"}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Địa chỉ"
                                value={venueAddress}
                                onChange={(e) => setVenueAddress(e.target.value)}
                                disabled={locationType === "ONLINE"}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Thành phố"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                disabled={locationType === "ONLINE"}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Bắt đầu"
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Kết thúc"
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Hạn đăng ký"
                                slotProps={{ inputLabel: { shrink: true } }}
                                value={registrationDeadline}
                                onChange={(e) => setRegistrationDeadline(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Loại Vé
                            </Typography>
                            <Button variant="outlined" startIcon={<Add />} onClick={addTicketType} disabled={isSaving}>
                                Thêm loại vé
                            </Button>
                        </Stack>

                        {ticketTypes.map((ticket, index) => (
                            <Card key={`ticket-${index}`} variant="outlined" sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                Loại vé #{index + 1}
                                            </Typography>
                                            <IconButton
                                                color="error"
                                                onClick={() => removeTicketType(index)}
                                                disabled={ticketTypes.length === 1 || isSaving}
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
                                                    onChange={(e) => updateTicket(index, "ticketName", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Giá"
                                                    value={ticket.price}
                                                    onChange={(e) => updateTicket(index, "price", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Tổng số lượng"
                                                    value={ticket.quantityTotal}
                                                    onChange={(e) => updateTicket(index, "quantityTotal", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Tối đa mua mỗi đơn"
                                                    value={ticket.maxPerOrder}
                                                    onChange={(e) => updateTicket(index, "maxPerOrder", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Mô tả vé"
                                                    value={ticket.description}
                                                    onChange={(e) => updateTicket(index, "description", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    type="datetime-local"
                                                    label="Mở bán"
                                                    slotProps={{ inputLabel: { shrink: true } }}
                                                    value={ticket.saleStartTime}
                                                    onChange={(e) => updateTicket(index, "saleStartTime", e.target.value)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    type="datetime-local"
                                                    label="Kết thúc bán"
                                                    slotProps={{ inputLabel: { shrink: true } }}
                                                    value={ticket.saleEndTime}
                                                    onChange={(e) => updateTicket(index, "saleEndTime", e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}

                    </Stack>
                </CardContent>
            </Card>
            <Stack direction="row" spacing={1.5} >
                <Button variant="contained" size="large" onClick={handleSave} disabled={isSaving || !canSave}>
                    {isSaving ? "Đang lưu..." : "Lưu sự kiện"}
                </Button>
            </Stack>
        </Stack>
    );
};

export default OrganizerCreateEventPage;
