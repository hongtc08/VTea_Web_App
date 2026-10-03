package com.kiemchung.vtea.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

/**
 * Dịch vụ xử lý JWT: sinh token và kiểm tra token.
 */
@Service
public class JwtService {

    // Đọc secret key từ application.yaml
    @Value("${app.jwt.secret}")
    private String secretKey;

    // Đọc thời gian hết hạn từ application.yaml (tính bằng milliseconds)
    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    // ===================== SINH TOKEN =====================

    /**
     * Sinh chuỗi JWT từ username.
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)               // Lưu username vào payload
                .setIssuedAt(new Date())            // Thời điểm tạo token
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Thời điểm hết hạn
                .signWith(getSignKey(), SignatureAlgorithm.HS256) // Ký bằng secret key
                .compact();
    }

    // ===================== ĐỌC TOKEN =====================

    /**
     * Lấy username từ bên trong token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Lấy thời gian hết hạn từ bên trong token.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Giải mã token rồi lấy ra thông tin bất kỳ.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSignKey()) // Dùng secret key để giải mã
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    // ===================== KIỂM TRA TOKEN =====================

    /**
     * Kiểm tra token có còn hạn sử dụng không.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Kiểm tra token có hợp lệ không:
     * - Username trong token phải khớp với user đang request
     * - Token chưa hết hạn
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // ==========================================

    /**
     * Chuyển chuỗi secret key (Base64) thành đối tượng Key để dùng ký token.
     */
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}