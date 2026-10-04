package com.kiemchung.vtea.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Ánh xạ với bảng 'users' trong cơ sở dữ liệu.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    private String phone;

    // Lưu giá trị enum dưới dạng chuỗi ("STAFF", "ADMIN") trong DB
    @Enumerated(EnumType.STRING)
    private Role role;

    // Lưu giá trị enum dưới dạng chuỗi ("ACTIVE", "DELETED") trong DB
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ===================== Getters & Setters =====================

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}