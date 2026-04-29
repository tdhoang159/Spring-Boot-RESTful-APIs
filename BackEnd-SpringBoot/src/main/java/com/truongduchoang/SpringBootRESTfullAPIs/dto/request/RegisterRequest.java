package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Tên không được bỏ trống")
    @Size(max = 150, message = "Tên không được vượt quá 150 ký tự")
    private String fullName;

    @NotBlank(message = "Email không được bỏ trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 150, message = "Email không được vượt quá 150 ký tự")
    private String email;

    @NotBlank(message = "Mật khẩu không được bỏ trống")
    @Size(min = 6, max = 255, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;

    @NotNull(message = "Vai trò không được bỏ trống")
    private RoleName role;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public RoleName getRole() {
        return role;
    }

    public void setRole(RoleName role) {
        this.role = role;
    }
}
