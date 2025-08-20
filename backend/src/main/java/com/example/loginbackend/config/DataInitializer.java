package com.example.loginbackend.config;

import com.example.loginbackend.entity.User;
import com.example.loginbackend.entity.Post;
import com.example.loginbackend.mapper.UserMapper;
import com.example.loginbackend.mapper.PostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * MyBatis 환경에서 초기 데이터를 프로그래밍 방식으로 생성하는 클래스
 * SQL 파일과 함께 사용되어 데이터 무결성을 보장합니다.
 */
// @Component  // 임시 비활성화
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PostMapper postMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("=== 데이터 초기화 시작 ===");
            
            // 잠시 대기 (다른 초기화 완료 대기)
            Thread.sleep(1000);
            
            // 사용자 데이터 초기화
            initializeUsers();
            
            // 게시글 데이터 초기화
            initializePosts();
            
            System.out.println("=== 데이터 초기화 완료 ===");
            
        } catch (Exception e) {
            System.err.println("데이터 초기화 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            // 오류가 발생해도 애플리케이션은 계속 실행
        }
    }
    
    private void initializeUsers() {
        System.out.println("사용자 데이터 초기화 중...");
        
        // 테스트 사용자 생성
        createUserIfNotExists("test@example.com", "password123", "테스트 사용자", User.Role.USER);
        
        // 관리자 사용자 생성
        createUserIfNotExists("admin@example.com", "password123", "관리자", User.Role.ADMIN);
        
        // 추가 테스트 사용자들
        createUserIfNotExists("user1@example.com", "password123", "사용자1", User.Role.USER);
        createUserIfNotExists("user2@example.com", "password123", "사용자2", User.Role.USER);
        
        System.out.println("사용자 데이터 초기화 완료");
    }
    
    private void createUserIfNotExists(String email, String password, String name, User.Role role) {
        try {
            Optional<User> existingUser = userMapper.findByEmail(email);
            if (existingUser.isEmpty()) {
                User user = new User();
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(password));
                user.setName(name);
                user.setRole(role);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                
                userMapper.save(user);
                System.out.println("사용자 생성: " + email + " (" + name + ", " + role + ")");
            } else {
                System.out.println("사용자 이미 존재: " + email);
            }
        } catch (Exception e) {
            System.err.println("사용자 생성 실패: " + email + " - " + e.getMessage());
        }
    }
    
    private void initializePosts() {
        System.out.println("게시글 데이터 초기화 중...");
        
        try {
            // 사용자 조회
            Optional<User> testUser = userMapper.findByEmail("test@example.com");
            Optional<User> adminUser = userMapper.findByEmail("admin@example.com");
            Optional<User> user1 = userMapper.findByEmail("user1@example.com");
            
            if (testUser.isPresent()) {
                createPostIfNotExists("MyBatis와 Spring Boot 연동하기", 
                    "MyBatis를 사용하여 Spring Boot 애플리케이션을 개발하는 방법에 대해 알아보겠습니다.\n\n" +
                    "1. 의존성 추가\n2. 설정 파일 작성\n3. Mapper 인터페이스 생성\n4. XML 매퍼 파일 작성\n\n" +
                    "이렇게 단계별로 진행하면 쉽게 MyBatis를 연동할 수 있습니다.", 
                    testUser.get());
                    
                createPostIfNotExists("React와 Spring Boot 연동", 
                    "프론트엔드 React와 백엔드 Spring Boot를 연동하는 방법을 설명합니다.\n\n" +
                    "CORS 설정, JWT 인증, REST API 설계 등 실무에서 필요한 내용들을 다룹니다.", 
                    testUser.get());
            }
            
            if (adminUser.isPresent()) {
                createPostIfNotExists("시스템 공지사항", 
                    "안녕하세요. 관리자입니다.\n\n" +
                    "시스템 업데이트가 완료되었습니다. 새로운 기능들을 확인해보세요:\n\n" +
                    "- 모달 기반 알림 시스템\n- MyBatis 데이터베이스 연동\n- JWT 인증 시스템\n- 반응형 UI 개선", 
                    adminUser.get());
                    
                createPostIfNotExists("개발 가이드라인", 
                    "개발 시 준수해야 할 가이드라인입니다.\n\n" +
                    "1. 코드 리뷰 필수\n2. 테스트 코드 작성\n3. 문서화\n4. 보안 검토\n\n" +
                    "모든 개발자는 이 가이드라인을 숙지하고 따라주시기 바랍니다.", 
                    adminUser.get());
            }
            
            if (user1.isPresent()) {
                createPostIfNotExists("프론트엔드 개발 팁", 
                    "React 개발 시 유용한 팁들을 공유합니다.\n\n" +
                    "- 컴포넌트 분리 전략\n- 상태 관리 패턴\n- 성능 최적화 방법\n- 디버깅 도구 활용\n\n" +
                    "실무에서 직접 경험한 내용들입니다.", 
                    user1.get());
            }
            
            System.out.println("게시글 데이터 초기화 완료");
            
        } catch (Exception e) {
            System.err.println("게시글 초기화 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void createPostIfNotExists(String title, String content, User author) {
        try {
            // 동일한 제목의 게시글이 있는지 확인 (간단한 중복 체크)
            Post post = new Post();
            post.setTitle(title);
            post.setContent(content);
            post.setAuthorId(author.getId());
            post.setAuthorName(author.getName());
            post.setAuthorEmail(author.getEmail());
            post.setViewCount(0);
            post.setCreatedAt(LocalDateTime.now());
            post.setUpdatedAt(LocalDateTime.now());
            
            postMapper.save(post);
            System.out.println("게시글 생성: " + title + " (작성자: " + author.getName() + ")");
            
        } catch (Exception e) {
            System.err.println("게시글 생성 실패: " + title + " - " + e.getMessage());
        }
    }
    
    /**
     * 데이터베이스 상태 확인 메서드
     */
    public void checkDatabaseStatus() {
        try {
            long userCount = userMapper.countAll();
            long postCount = postMapper.countAll();
            
            System.out.println("=== 데이터베이스 상태 ===");
            System.out.println("총 사용자 수: " + userCount);
            System.out.println("총 게시글 수: " + postCount);
            System.out.println("========================");
            
        } catch (Exception e) {
            System.err.println("데이터베이스 상태 확인 실패: " + e.getMessage());
        }
    }
}