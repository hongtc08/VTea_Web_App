package com.kiemchung.vtea.domain.dto.request;

import com.kiemchung.vtea.domain.entity.Role;

/**
 * DTO nhận dữ liệu từ Frontend khi gọi API tạo tài khoản mới.
 */
public class CreateUserRequest {
    
    private String username;

    private String password;

    private String fullName;

    private String phone;

    private Role role; // ADMIN hoặc STAFF

    // Getters & Setters
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
}
