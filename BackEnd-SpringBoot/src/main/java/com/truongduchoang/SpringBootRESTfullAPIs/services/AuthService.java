package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.LoginRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.RegisterRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.AuthResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.RegisterResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    RegisterResponse register(RegisterRequest request);
}
