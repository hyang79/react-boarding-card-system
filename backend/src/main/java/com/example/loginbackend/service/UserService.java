package com.example.loginbackend.service;

import com.example.loginbackend.entity.User;
import com.example.loginbackend.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userMapper.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));
    }
    
    public User createUser(String email, String password) {
        if (userMapper.existsByEmail(email)) {
            throw new RuntimeException("이미 존재하는 이메일입니다");
        }
        
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName("사용자"); // 기본 이름 설정
        user.setRole(User.Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userMapper.save(user);
        return user;
    }
    
    public User createUser(String email, String password, String name) {
        if (userMapper.existsByEmail(email)) {
            throw new RuntimeException("이미 존재하는 이메일입니다");
        }
        
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setRole(User.Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userMapper.save(user);
        return user;
    }
    
    public Optional<User> findByEmail(String email) {
        return userMapper.findByEmail(email);
    }
    
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    public String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
}