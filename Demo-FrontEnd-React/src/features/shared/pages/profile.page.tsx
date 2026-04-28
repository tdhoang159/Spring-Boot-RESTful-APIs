import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Avatar,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { updateAuthUser } from "../../auth/services/auth-session.service";
import { getCurrentUser } from "../../auth/services/auth.service";
import { changeMyPasswordAPI, getMyProfileAPI, updateMyProfileAPI } from "../services/profile.api";

const ProfilePage = () => {
    const user = getCurrentUser();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [initialFullName, setInitialFullName] = useState("");
    const [initialPhone, setInitialPhone] = useState("");

    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const previewUrl = useMemo(() => {
        if (!avatarFile) return null;
        return URL.createObjectURL(avatarFile);
    }, [avatarFile]);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const profile = await getMyProfileAPI();
                setEmail(profile.email ?? "");
                setFullName(profile.fullName ?? "");
                setPhone(profile.phone ?? "");
                setAvatarUrl(profile.avatarUrl ?? null);
                setInitialFullName(profile.fullName ?? "");
                setInitialPhone(profile.phone ?? "");
            } catch (apiError: any) {
                setError(apiError?.response?.data?.message ?? "Không thể tải thông tin profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setAvatarFile(file);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const updated = await updateMyProfileAPI({
                fullName: fullName.trim(),
                phone: phone.trim(),
                avatar: avatarFile,
            });

            setEmail(updated.email ?? "");
            setFullName(updated.fullName ?? "");
            setPhone(updated.phone ?? "");
            setAvatarUrl(updated.avatarUrl ?? null);
            setInitialFullName(updated.fullName ?? "");
            setInitialPhone(updated.phone ?? "");
            setAvatarFile(null);
            updateAuthUser({ fullName: updated.fullName });
            setSuccess("Đã cập nhật profile thành công");
        } catch (apiError: any) {
            setError(apiError?.response?.data?.message ?? "Cập nhật profile thất bại");
        } finally {
            setSaving(false);
        }
    };

    const profileChanged =
        fullName.trim() !== initialFullName.trim() ||
        phone.trim() !== initialPhone.trim() ||
        avatarFile !== null;

    const canSaveProfile = profileChanged && !saving && fullName.trim().length > 0;

    const openPasswordDialog = () => {
        setPasswordError(null);
        setPasswordSuccess(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordDialogOpen(true);
    };

    const closePasswordDialog = () => {
        if (passwordSaving) {
            return;
        }
        setPasswordDialogOpen(false);
        setPasswordError(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleChangePassword = async () => {
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Vui lòng nhập đầy đủ thông tin mật khẩu");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Mật khẩu mới phải từ 6 ký tự");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Xác nhận mật khẩu mới không khớp");
            return;
        }

        setPasswordSaving(true);
        try {
            await changeMyPasswordAPI({
                currentPassword,
                newPassword,
                confirmPassword,
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordSuccess("Đổi mật khẩu thành công");
            setPasswordDialogOpen(false);
        } catch (apiError: any) {
            setPasswordError(apiError?.response?.data?.message ?? "Đổi mật khẩu thất bại");
        } finally {
            setPasswordSaving(false);
        }
    };

    const canChangePassword =
        !passwordSaving &&
        currentPassword.length > 0 &&
        newPassword.length >= 6 &&
        confirmPassword.length > 0;

    if (loading) {
        return (
            <Stack sx={{ py: 8, alignItems: "center" }}>
                <CircularProgress />
            </Stack>
        );
    }

    return (
        <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid rgba(11, 53, 88, 0.12)" }}>
            <CardContent>
                <Stack spacing={3}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Profile
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    {passwordSuccess && <Alert severity="success">{passwordSuccess}</Alert>}

                    <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                        <Stack spacing={2} sx={{ alignItems: { xs: "flex-start", md: "center" }, minWidth: 180 }}>
                            <Avatar
                                src={previewUrl ?? avatarUrl ?? undefined}
                                sx={{ width: 84, height: 84, bgcolor: "#0B3558", fontSize: 32 }}
                            >
                                {(fullName || user?.fullName)?.slice(0, 1)?.toUpperCase() ?? "U"}
                            </Avatar>
                            <Button variant="outlined" component="label">
                                Chọn avatar
                                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                            </Button>
                            {avatarFile && (
                                <Typography variant="caption" color="text.secondary">
                                    {avatarFile.name}
                                </Typography>
                            )}
                        </Stack>

                        <Stack spacing={2} sx={{ flex: 1 }}>
                            <TextField
                                label="Email"
                                value={email}
                                fullWidth
                                disabled
                                helperText="Email không thể chỉnh sửa"
                            />
                            <TextField
                                label="Họ và tên"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Số điện thoại"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                fullWidth
                            />
                            <Stack direction="row" spacing={1.5}>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    disabled={!canSaveProfile}
                                    sx={{ minWidth: 150 }}
                                >
                                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={openPasswordDialog}
                                    sx={{ minWidth: 170 }}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>

            <Dialog
                open={passwordDialogOpen}
                onClose={closePasswordDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {passwordError && <Alert severity="error">{passwordError}</Alert>}
                        <TextField
                            label="Mật khẩu hiện tại"
                            type="password"
                            value={currentPassword}
                            onChange={(event) => setCurrentPassword(event.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Mật khẩu mới"
                            type="password"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            helperText="Tối thiểu 6 ký tự"
                            fullWidth
                        />
                        <TextField
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closePasswordDialog} disabled={passwordSaving}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={!canChangePassword}
                    >
                        {passwordSaving ? "Đang đổi..." : "Cập nhật mật khẩu"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default ProfilePage;
