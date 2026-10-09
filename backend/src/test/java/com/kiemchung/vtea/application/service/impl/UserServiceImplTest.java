package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.request.CreateUserRequest;
import com.kiemchung.vtea.domain.dto.response.UserResponse;
import com.kiemchung.vtea.domain.entity.Role;
import com.kiemchung.vtea.domain.entity.Status;
import com.kiemchung.vtea.domain.entity.User;
import com.kiemchung.vtea.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private CreateUserRequest request;
    private User savedUser;

    @BeforeEach
    void setUp() {
        request = new CreateUserRequest();
        request.setUsername("staff1");
        request.setPassword("123456");
        request.setFullName("Nguyen Van A");
        request.setPhone("0123456789");
        request.setRole(Role.STAFF);

        savedUser = new User();
        savedUser.setUserId(1);
        savedUser.setUsername("staff1");
        savedUser.setPassword("encoded_password");
        savedUser.setFullName("Nguyen Van A");
        savedUser.setPhone("0123456789");
        savedUser.setRole(Role.STAFF);
        savedUser.setStatus(Status.ACTIVE);
        savedUser.setCreatedAt(LocalDateTime.now());
        savedUser.setStartDate(LocalDateTime.now());
    }

    @Test
    void createUser_Success() {
        // Arrange
        when(userRepository.existsByUsername("staff1")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        UserResponse response = userService.createUser(request);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getUserId());
        assertEquals("staff1", response.getUsername());
        assertEquals("Nguyen Van A", response.getFullName());
        assertEquals("0123456789", response.getPhone());
        assertEquals(Role.STAFF, response.getRole());
        assertEquals(Status.ACTIVE, response.getStatus());
        assertNotNull(response.getCreatedAt());

        verify(userRepository, times(1)).existsByUsername("staff1");
        verify(passwordEncoder, times(1)).encode("123456");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void createUser_ThrowsException_WhenUsernameExists() {
        // Arrange
        when(userRepository.existsByUsername("staff1")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(request);
        });

        assertEquals("Tên đăng nhập đã tồn tại!", exception.getMessage());
        verify(userRepository, times(1)).existsByUsername("staff1");
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }
}
