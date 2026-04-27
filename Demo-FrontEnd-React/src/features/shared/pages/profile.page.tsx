import { Avatar, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { getCurrentUser } from "../../auth/services/auth.service";

const ProfilePage = () => {
    const user = getCurrentUser();

    return (
        <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
            <CardContent>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    sx={{ alignItems: { xs: "flex-start", md: "center" } }}
                >
                    <Avatar sx={{ width: 68, height: 68, bgcolor: "#0B3558", fontSize: 28 }}>
                        {user?.fullName?.slice(0, 1)?.toUpperCase() ?? "U"}
                    </Avatar>
                    <Stack spacing={1}>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Profile
                        </Typography>
                        <Typography color="text.secondary">Name: {user?.fullName ?? "N/A"}</Typography>
                        <Typography color="text.secondary">Email: {user?.email ?? "N/A"}</Typography>
                        <Chip label={`Role: ${user?.role ?? "N/A"}`} color="primary" sx={{ width: "fit-content" }} />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ProfilePage;
