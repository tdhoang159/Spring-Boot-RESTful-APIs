package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.MediaUploadResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.FileUploadException;
import com.truongduchoang.SpringBootRESTfullAPIs.services.CloudinaryService;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
    private static final List<String> ALLOWED_IMAGE_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/webp");

    private final Cloudinary cloudinary;
    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;

    public CloudinaryServiceImpl(
            Cloudinary cloudinary,
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret) {
        this.cloudinary = cloudinary;
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    @Override
    public MediaUploadResponse uploadImage(MultipartFile file, String folder) {
        validateFile(file);
        validateCloudinaryConfig();

        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", StringUtils.hasText(folder) ? folder : "event-management",
                            "resource_type", "image"));

            Object secureUrl = uploadResult.get("secure_url");
            Object publicId = uploadResult.get("public_id");

            if (secureUrl == null || publicId == null) {
                throw new FileUploadException("Cloudinary response is missing upload URL", "UPLOAD_RESPONSE_INVALID");
            }

            return new MediaUploadResponse(secureUrl.toString(), publicId.toString());
        } catch (IOException ex) {
            throw new FileUploadException("Cannot read upload file", "FILE_READ_ERROR", ex);
        } catch (RuntimeException ex) {
            if (ex instanceof FileUploadException) {
                throw ex;
            }
            throw new FileUploadException("Upload image to Cloudinary failed", "CLOUDINARY_UPLOAD_FAILED", ex);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Upload file is empty", "FILE_EMPTY");
        }
        if (file.getSize() > MAX_IMAGE_SIZE_BYTES) {
            throw new FileUploadException("Image size must not exceed 5MB", "FILE_SIZE_EXCEEDED");
        }
        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType) || !ALLOWED_IMAGE_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new FileUploadException("Only JPG, JPEG, PNG, or WEBP image files are allowed", "FILE_TYPE_INVALID");
        }
    }

    private void validateCloudinaryConfig() {
        if (!StringUtils.hasText(cloudName) || !StringUtils.hasText(apiKey) || !StringUtils.hasText(apiSecret)) {
            throw new FileUploadException("Cloudinary configuration is missing", "CLOUDINARY_CONFIG_MISSING");
        }
    }
}
