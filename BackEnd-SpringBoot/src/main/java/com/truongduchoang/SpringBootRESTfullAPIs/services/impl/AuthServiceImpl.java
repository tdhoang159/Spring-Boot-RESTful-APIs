package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.LoginRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.AuthResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.BadRequestException;
import com.truongduchoang.SpringBootRESTfullAPIs.models.User;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.UserStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.UserRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.security.JwtService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException(
                        "Email hoặc mật khẩu không đúng",
                        "INVALID_CREDENTIALS"));

        if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            throw new BadRequestException(
                    "Tài khoản chưa có mật khẩu hợp lệ để đăng nhập",
                    "INVALID_CREDENTIALS");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException(
                    "Email hoặc mật khẩu không đúng",
                    "INVALID_CREDENTIALS");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException(
                    "Tài khoản hiện không thể đăng nhập",
                    "ACCOUNT_INACTIVE");
        }

        if (user.getRole() == null || user.getRole().getRoleName() == null) {
            throw new BadRequestException(
                    "Tài khoản chưa được gán quyền truy cập",
                    "ROLE_NOT_ASSIGNED");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setAccessToken(jwtService.generateToken(user));
        response.setTokenType("Bearer");
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().getRoleName());
        return response;
    }
}
