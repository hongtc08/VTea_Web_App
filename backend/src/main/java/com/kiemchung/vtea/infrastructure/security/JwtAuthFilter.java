package com.kiemchung.vtea.infrastructure.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Bộ lọc JWT: chặn mọi request, kiểm tra token trong Header trước khi vào Controller.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter { //đảm bảo filter chỉ chạy đúng 1 lần cho mỗi request

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy giá trị Header "Authorization" từ request
        String authHeader = request.getHeader("Authorization");

        // Nếu không có Header hoặc không bắt đầu bằng "Bearer " thì bỏ qua, cho đi tiếp
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Cắt bỏ chữ "Bearer " (7 ký tự) để lấy chuỗi token thuần
            String token = authHeader.substring(7);

            // Giải mã token để lấy username
            String username = jwtService.extractUsername(token);

            // Nếu có username và user chưa được xác thực trong phiên hiện tại
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Tìm user trong DB
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Kiểm tra token có hợp lệ không
                if (jwtService.isTokenValid(token, userDetails)) {

                    // Nếu hợp lệ: tạo đối tượng xác thực và nạp vào Security Context
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities() // Danh sách quyền (ROLE_ADMIN, ROLE_STAFF)
                            );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            System.err.println("JWT Filter Error: " + e.getMessage());
        }

        // Cho request đi tiếp vào Controller
        filterChain.doFilter(request, response);
    }
}