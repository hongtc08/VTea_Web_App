package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.CreateUserRequest;
import com.kiemchung.vtea.domain.dto.response.UserResponse;

/**
 * Interface định nghĩa các nghiệp vụ liên quan đến quản lý User.
 */
public interface UserService {
    UserResponse createUser(CreateUserRequest request);
}
