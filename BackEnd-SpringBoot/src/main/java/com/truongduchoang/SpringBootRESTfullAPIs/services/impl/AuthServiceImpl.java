package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.LoginRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.RegisterRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.AuthResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.RegisterResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.BadRequestException;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.DuplicateResourceException;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Role;
import com.truongduchoang.SpringBootRESTfullAPIs.models.User;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.RoleName;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.UserStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.RoleRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.UserRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.security.JwtService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.AuthService;
import org.springframework.util.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
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

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException(
                    "Email đã tồn tại",
                    "EMAIL_ALREADY_EXISTS");
        }

        if (request.getRole() == RoleName.ADMIN) {
            throw new BadRequestException(
                    "Không thể tự đăng ký tài khoản quản trị",
                    "INVALID_ROLE");
        }

        Role role = roleRepository.findByRoleName(request.getRole())
                .orElseThrow(() -> new BadRequestException(
                        "Vai trò không hợp lệ",
                        "ROLE_NOT_FOUND"));

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setRole(role);
        user.setStatus(UserStatus.ACTIVE);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        RegisterResponse response = new RegisterResponse();
        response.setUserId(savedUser.getUserId());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole().getRoleName().name());
        return response;
    }
}
