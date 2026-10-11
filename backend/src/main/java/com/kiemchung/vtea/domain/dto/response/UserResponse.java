package com.kiemchung.vtea.domain.dto.response;

import com.kiemchung.vtea.domain.entity.Role;
import com.kiemchung.vtea.domain.entity.Status;
import java.time.LocalDateTime;

/**
 * DTO dùng để trả về thông tin của User sau khi thao tác (như tạo mới) thành công.
 */
public class UserResponse {
    private Integer userId;
    private String username;
    private String fullName;
    private String phone;
    private Role role;
    private Status status;
    private LocalDateTime createdAt;

    // Getters & Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
