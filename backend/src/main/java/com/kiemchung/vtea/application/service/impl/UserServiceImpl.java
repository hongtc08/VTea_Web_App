package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.UserService;
import com.kiemchung.vtea.domain.dto.request.CreateUserRequest;
import com.kiemchung.vtea.domain.dto.response.UserResponse;
import com.kiemchung.vtea.domain.entity.Status;
import com.kiemchung.vtea.domain.entity.User;
import com.kiemchung.vtea.domain.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Class thực thi các nghiệp vụ quản lý User.
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        // Tạo Entity mới
        User user = new User();
        user.setUsername(request.getUsername());
        // Băm mật khẩu trước khi lưu xuống database
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole()); // STAFF hoặc ADMIN
        user.setStatus(Status.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setStartDate(LocalDateTime.now());

        // Lưu vào DB
        User savedUser = userRepository.save(user);

        // Chuyển sang DTO để trả về
        return mapToResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + id));
        return mapToResponse(user);
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setStatus(user.getStatus());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
