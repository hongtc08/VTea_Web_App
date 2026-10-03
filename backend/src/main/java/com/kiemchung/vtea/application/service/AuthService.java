package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.LoginRequest;
import com.kiemchung.vtea.domain.dto.response.LoginResponse;

/**
 * Interface định nghĩa các nghiệp vụ xác thực.
 * Controller chỉ được phép gọi qua interface này.
 */
public interface AuthService {

    /**
     * Kiểm tra tài khoản và sinh JWT token.
     */
    LoginResponse login(LoginRequest request);
}