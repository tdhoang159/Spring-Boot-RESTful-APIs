package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.ChangePasswordRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.UserProfileUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.UserProfileResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users/me/profile")
public class UserProfileController {

    private final UserService userService;

    public UserProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile() {
        UserProfileResponse profile = userService.getCurrentUserProfile();
        ApiResponse<UserProfileResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                "Get profile successfully",
                profile,
                null
        );
        return ResponseEntity.ok(result);
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @Valid @ModelAttribute UserProfileUpdateRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        UserProfileResponse profile = userService.updateCurrentUserProfile(request, avatar);
        ApiResponse<UserProfileResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                "Update profile successfully",
                profile,
                null
        );
        return ResponseEntity.ok(result);
    }

    @PatchMapping(value = "/password", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changeCurrentUserPassword(request);
        ApiResponse<Void> result = new ApiResponse<>(
                HttpStatus.OK,
                "Change password successfully",
                null,
                null
        );
        return ResponseEntity.ok(result);
    }
}