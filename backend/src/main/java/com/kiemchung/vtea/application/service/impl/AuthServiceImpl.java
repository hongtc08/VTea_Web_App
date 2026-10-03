package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.AuthService;
import com.kiemchung.vtea.domain.dto.request.LoginRequest;
import com.kiemchung.vtea.domain.dto.response.LoginResponse;
import com.kiemchung.vtea.infrastructure.security.CustomUserDetails;
import com.kiemchung.vtea.infrastructure.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

/**
 * Triển khai nghiệp vụ xác thực.
 */
@Service
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    /**
     * Xử lý đăng nhập:
     * 1. Nhờ Spring Security kiểm tra username + password với DB
     * 2. Nếu đúng → sinh token → trả về client
     */
    @Override
    public LoginResponse login(LoginRequest request) {
        // Giao cho Spring Security xác thực — nếu sai sẽ tự ném BadCredentialsException
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Lấy thông tin user sau khi xác thực thành công
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // Sinh token từ username
        String token = jwtService.generateToken(userDetails.getUsername());

        return new LoginResponse(token, userDetails.getUsername(), userDetails.getAuthorities()
                .iterator().next().getAuthority());
    }
}