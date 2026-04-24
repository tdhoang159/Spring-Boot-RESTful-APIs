package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;


import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.LocationType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public class EventSearchRequest {

    @Size(max = 100, message = "Keyword không được vượt quá 100 ký tự")
    private String keyword;

    @Min(value = 1, message = "categoryId phải là số dương")
    private Long categoryId;

    @Size(max = 100, message = "City không được vượt quá 100 ký tự")
    private String city;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) // nhận đúng định dạng yyyy-MM-dd từ query param
    private LocalDate date;

    // LocationType tự validate bởi Spring khi parse Enum —
    // nếu gửi sai giá trị sẽ trả 400 tự động.
    // Đã thêm fromString() vào LocationType để chấp nhận lowercase.
    private LocationType locationType;

    @Min(value = 0, message = "Page phải >= 0")
    private int page = 0;

    @Min(value = 1, message = "Size phải >= 1")
    @Max(value = 50, message = "Size không được vượt quá 50")
    private int size = 10;

    @Pattern(
            regexp = "^(title|startTime|endTime)$",
            message = "sortBy chỉ chấp nhận: title, startTime, endTime"
    )
    private String sortBy = "startTime";

    @Pattern(
            regexp = "^(asc|desc)$",
            message = "sortDir chỉ chấp nhận: asc, desc"
    )
    private String sortDir = "asc";

    public EventSearchRequest() {}

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocationType getLocationType() { return locationType; }
    public void setLocationType(LocationType locationType) { this.locationType = locationType; }
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }
    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
    public String getSortDir() { return sortDir; }
    public void setSortDir(String sortDir) { this.sortDir = sortDir; }
}