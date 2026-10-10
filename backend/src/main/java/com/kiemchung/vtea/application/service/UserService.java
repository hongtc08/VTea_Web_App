package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.CreateUserRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateUserRequest;
import com.kiemchung.vtea.domain.dto.response.UserResponse;

import java.util.List;

/**
 * Interface định nghĩa các nghiệp vụ liên quan đến quản lý User.
 */
public interface UserService {
    UserResponse createUser(CreateUserRequest request);
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Integer id);
    UserResponse updateUser(Integer id, UpdateUserRequest request);
    void deleteUser(Integer id);
}
