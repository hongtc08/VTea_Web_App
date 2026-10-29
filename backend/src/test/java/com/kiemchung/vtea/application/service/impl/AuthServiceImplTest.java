package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.request.LoginRequest;
import com.kiemchung.vtea.domain.dto.response.LoginResponse;
import com.kiemchung.vtea.domain.entity.Role;
import com.kiemchung.vtea.domain.entity.Status;
import com.kiemchung.vtea.domain.entity.User;
import com.kiemchung.vtea.infrastructure.security.CustomUserDetails;
import com.kiemchung.vtea.infrastructure.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Mục đích file: Unit test cho AuthServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void login_Success_ReturnsLoginResponse() {
        LoginRequest req = new LoginRequest();
        req.setUsername("admin");
        req.setPassword("123456");

        User user = new User();
        user.setUsername("admin");
        user.setRole(Role.ADMIN);
        user.setStatus(Status.ACTIVE);
        CustomUserDetails userDetails = new CustomUserDetails(user);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtService.generateToken("admin")).thenReturn("mocked_jwt_token");

        LoginResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mocked_jwt_token", res.getToken());
        assertEquals("admin", res.getUsername());
        assertEquals("ROLE_ADMIN", res.getRole());
    }

    @Test
    void login_BadCredentials_ThrowsException() {
        LoginRequest req = new LoginRequest();
        req.setUsername("admin");
        req.setPassword("wrong_pass");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
        verify(jwtService, never()).generateToken(anyString());
    }
}
