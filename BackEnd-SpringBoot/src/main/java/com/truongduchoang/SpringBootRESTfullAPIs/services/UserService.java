package com.truongduchoang.SpringBootRESTfullAPIs.services;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.ChangePasswordRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.UserCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.UserProfileUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.UserUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.UserProfileResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.UserResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.User;

public interface UserService {
    UserResponse createUser(UserCreateRequest request, MultipartFile avatar);

    List<UserResponse> getAllUserResponses();

    UserResponse getUserResponseById(Long id);

    UserResponse updateUser(Long id, UserUpdateRequest request, MultipartFile avatar);

    UserProfileResponse getCurrentUserProfile();

    UserProfileResponse updateCurrentUserProfile(UserProfileUpdateRequest request, MultipartFile avatar);

    void changeCurrentUserPassword(ChangePasswordRequest request);

    User createUser(User user);

    List<User> getAllUsers();

    Optional<User> getUserById(long id);

    User updateUser(long id, User updatedUser);

    void deleteUser(long id);
}
