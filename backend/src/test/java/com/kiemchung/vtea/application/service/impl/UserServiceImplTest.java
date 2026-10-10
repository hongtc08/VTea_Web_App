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

    @Test
    void getAllUsers_Success() {
        // Arrange
        when(userRepository.findAll()).thenReturn(java.util.List.of(savedUser));

        // Act
        java.util.List<UserResponse> responses = userService.getAllUsers();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("staff1", responses.get(0).getUsername());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUserById_Success() {
        // Arrange
        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(savedUser));

        // Act
        UserResponse response = userService.getUserById(1);

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getUserId());
        assertEquals("staff1", response.getUsername());
        verify(userRepository, times(1)).findById(1);
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(99)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.getUserById(99);
        });

        assertTrue(exception.getMessage().contains("Không tìm thấy tài khoản với ID: 99"));
        verify(userRepository, times(1)).findById(99);
    }

    @Test
    void updateUser_Success() {
        // Arrange
        com.kiemchung.vtea.domain.dto.request.UpdateUserRequest updateRequest = new com.kiemchung.vtea.domain.dto.request.UpdateUserRequest();
        updateRequest.setFullName("Nguyen Van B");
        updateRequest.setPhone("0999999999");
        updateRequest.setStatus(Status.DELETED);

        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(savedUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        UserResponse response = userService.updateUser(1, updateRequest);

        // Assert
        assertNotNull(response);
        assertEquals("Nguyen Van B", response.getFullName());
        assertEquals("0999999999", response.getPhone());
        assertEquals(Status.DELETED, response.getStatus());
        assertEquals(Role.STAFF, response.getRole()); // Role không bị ghi đè thành null
        
        verify(userRepository, times(1)).findById(1);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void deleteUser_Success() {
        // Arrange
        when(userRepository.findById(1)).thenReturn(java.util.Optional.of(savedUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        userService.deleteUser(1);

        // Assert
        assertEquals(Status.DELETED, savedUser.getStatus());
        verify(userRepository, times(1)).findById(1);
        verify(userRepository, times(1)).save(savedUser);
    }

    @Test
    void deleteUser_NotFound_ThrowsException() {
        // Arrange
        when(userRepository.findById(99)).thenReturn(java.util.Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.deleteUser(99);
        });

        assertTrue(exception.getMessage().contains("Không tìm thấy tài khoản với ID: 99"));
        verify(userRepository, times(1)).findById(99);
        verify(userRepository, never()).save(any(User.class));
    }
}
