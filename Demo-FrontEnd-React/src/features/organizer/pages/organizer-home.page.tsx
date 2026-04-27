import CampaignIcon from "@mui/icons-material/Campaign";
import SendIcon from '@mui/icons-material/Send';
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GroupIcon from "@mui/icons-material/Group";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import PublishIcon from "@mui/icons-material/Publish";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

const features = [
    {
        title: "Tạo sự kiện",
        desc: "Nhập thông tin sự kiện, loại vé và giá vé.",
        to: "/organizer/create-event",
        icon: <EventAvailableIcon fontSize="large" />,
    },
    {
        title: "Sự kiện của tôi",
        desc: "Quản lý danh sách sự kiện và trạng thái xuất bản.",
        to: "/organizer/events",
        icon: <PublishIcon fontSize="large" />,
    },
    {
        title: "Người đăng ký",
        desc: "Xem danh sách người tham dự đã đăng ký.",
        to: "/organizer/registrations",
        icon: <GroupIcon fontSize="large" />,
    },
    {
        title: "Gửi email",
        desc: "Gửi email thông báo cho người tham dự.",
        to: "/organizer/send-email",
        icon: <CampaignIcon fontSize="large" />,
    },
    {
        title: "Xem email",
        desc: "Xem danh sách email đã gửi.",
        to: "/organizer/view-email",
        icon: <SendIcon fontSize="large" />,
    },
    {
        title: "Báo cáo bán vé",
        desc: "Theo dõi doanh thu và số lượng vé theo kỳ.",
        to: "/organizer/sales-report",
        icon: <InsertChartIcon fontSize="large" />,
    },
];

const OrganizerHomePage = () => {
    return (
        <Stack spacing={3}>
            <Box className="hero-banner">
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    Organizer HomePage
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                    Trang chủ của người tổ chức.
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {features.map((feature) => (
                    <Grid key={feature.to} size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card
                            component={RouterLink}
                            to={feature.to}
                            className="feature-card"
                            elevation={0}
                            sx={{ textDecoration: "none" }}
                        >
                            <CardContent>
                                <Stack spacing={1.5}>
                                    <Box color="#0B3558">{feature.icon}</Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }} color="text.primary">
                                        {feature.title}
                                    </Typography>
                                    <Typography color="text.secondary">{feature.desc}</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
};

export default OrganizerHomePage;
