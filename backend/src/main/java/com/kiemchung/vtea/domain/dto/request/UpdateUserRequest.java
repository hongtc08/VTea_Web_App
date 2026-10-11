package com.kiemchung.vtea.domain.dto.request;

import com.kiemchung.vtea.domain.entity.Role;
import com.kiemchung.vtea.domain.entity.Status;

/**
 * DTO nhận dữ liệu cập nhật User.
 */
public class UpdateUserRequest {
    
    private String fullName;
    private String phone;
    private Role role;
    private Status status; // Cho phép Admin thay đổi trạng thái (ACTIVE/DELETED)

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
