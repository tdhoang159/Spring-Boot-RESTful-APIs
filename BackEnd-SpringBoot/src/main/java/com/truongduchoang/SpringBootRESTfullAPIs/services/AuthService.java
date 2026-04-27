package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.LoginRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
