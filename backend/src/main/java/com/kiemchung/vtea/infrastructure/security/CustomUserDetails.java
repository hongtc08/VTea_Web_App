package com.kiemchung.vtea.infrastructure.security;

import com.kiemchung.vtea.domain.entity.Status;
import com.kiemchung.vtea.domain.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Bọc User entity thành dạng UserDetails mà Spring Security hiểu được.
 */
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    /**
     * Trả về danh sách quyền của user (ROLE_ADMIN hoặc ROLE_STAFF).
     * Spring Security kiểm tra phân quyền.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    /**
     * Tài khoản có đang hoạt động không (status = ACTIVE).
     */
    @Override
    public boolean isEnabled() {
        return user.getStatus() == Status.ACTIVE;
    }

    // Các hàm bên dưới mặc định trả về true
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }
}