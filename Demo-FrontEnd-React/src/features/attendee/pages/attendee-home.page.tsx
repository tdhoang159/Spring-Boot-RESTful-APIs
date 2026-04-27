import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventIcon from "@mui/icons-material/Event";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";

const cards = [
  {
    title: "Sự kiện sắp tới",
    desc: "Khám phá sự kiện mới được Organizer publish.",
    icon: <EventIcon fontSize="large" />,
  },
  {
    title: "Vé của tôi",
    desc: "Quản lý danh sách vé đã mua và tình trạng check-in.",
    icon: <ConfirmationNumberIcon fontSize="large" />,
  },
  {
    title: "Mã QR check-in",
    desc: "Hiển thị QR để vào cổng tại sự kiện.",
    icon: <QrCode2Icon fontSize="large" />,
  },
];

const AttendeeHomePage = () => {
  return (
    <Stack spacing={3}>
      <Box className="hero-banner">
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          Attendee HomePage
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
          Trang dành cho người tham dự sự kiện.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, md: 4 }}>
            <Card className="feature-card" elevation={0}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Box color="#0B3558">{card.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {card.title}
                  </Typography>
                  <Typography color="text.secondary">{card.desc}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default AttendeeHomePage;
