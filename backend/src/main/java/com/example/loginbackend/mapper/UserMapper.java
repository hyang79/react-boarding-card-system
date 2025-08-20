package com.example.loginbackend.mapper;

import com.example.loginbackend.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface UserMapper {
    
    /**
     * 이메일로 사용자 조회
     */
    Optional<User> findByEmail(@Param("email") String email);
    
    /**
     * 사용자 저장
     */
    void save(User user);
    
    /**
     * ID로 사용자 조회
     */
    Optional<User> findById(@Param("id") Long id);
    
    /**
     * 이메일 존재 여부 확인
     */
    boolean existsByEmail(@Param("email") String email);
    
    /**
     * 사용자 정보 업데이트
     */
    void update(User user);
    
    /**
     * 사용자 삭제
     */
    void deleteById(@Param("id") Long id);
    
    /**
     * 전체 사용자 수 조회
     */
    long countAll();
}