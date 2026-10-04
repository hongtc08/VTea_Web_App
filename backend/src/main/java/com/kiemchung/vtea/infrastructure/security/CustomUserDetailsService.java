package com.kiemchung.vtea.infrastructure.security;

import com.kiemchung.vtea.domain.entity.User;
import com.kiemchung.vtea.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Chỉ cho Spring Security cách tìm user từ database bằng username.
 * Spring sẽ tự gọi hàm mỗi khi cần xác thực.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Tìm user trong DB theo username.
     * Nếu không tìm thấy thì ném lỗi
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Không tìm thấy tài khoản: " + username
                ));
        return new CustomUserDetails(user);
    }
}