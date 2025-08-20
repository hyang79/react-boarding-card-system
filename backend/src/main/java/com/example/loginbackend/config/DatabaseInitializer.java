package com.example.loginbackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1) // 가장 먼저 실행
public class DatabaseInitializer implements CommandLineRunner {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== 데이터베이스 초기화 시작 ===");
        
        try {
            // 기존 테이블 삭제
            dropTables();
            
            // 테이블 생성
            createTables();
            
            // 초기 데이터 삽입
            insertInitialData();
            
            // 테이블 확인
            verifyTables();
            
            System.out.println("=== 데이터베이스 초기화 완료 ===");
            
        } catch (Exception e) {
            System.err.println("데이터베이스 초기화 실패: " + e.getMessage());
            e.printStackTrace();
            throw e; // 초기화 실패 시 애플리케이션 중단
        }
    }
    
    private void dropTables() {
        System.out.println("기존 테이블 삭제 중...");
        try {
            jdbcTemplate.execute("DROP TABLE IF EXISTS posts");
            jdbcTemplate.execute("DROP TABLE IF EXISTS users");
            System.out.println("기존 테이블 삭제 완료");
        } catch (Exception e) {
            System.out.println("테이블 삭제 중 오류 (무시): " + e.getMessage());
        }
    }
    
    private void createTables() {
        System.out.println("테이블 생성 중...");
        
        try {
            // 사용자 테이블 생성
            String createUsersTable = "CREATE TABLE users (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "email VARCHAR(255) NOT NULL UNIQUE, " +
                "password VARCHAR(255) NOT NULL, " +
                "name VARCHAR(100) NOT NULL, " +
                "role VARCHAR(20) DEFAULT 'USER', " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                ")";
            
            jdbcTemplate.execute(createUsersTable);
            System.out.println("users 테이블 생성 완료");
            
        } catch (Exception e) {
            System.err.println("users 테이블 생성 실패: " + e.getMessage());
            throw e;
        }
        
        try {
            // 게시글 테이블 생성
            String createPostsTable = "CREATE TABLE posts (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "title VARCHAR(200) NOT NULL, " +
                "content TEXT NOT NULL, " +
                "author_id BIGINT NOT NULL, " +
                "author_name VARCHAR(100) NOT NULL, " +
                "author_email VARCHAR(255) NOT NULL, " +
                "view_count INT DEFAULT 0, " +
                "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                "FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE" +
                ")";
            
            jdbcTemplate.execute(createPostsTable);
            System.out.println("posts 테이블 생성 완료");
            
        } catch (Exception e) {
            System.err.println("posts 테이블 생성 실패: " + e.getMessage());
            throw e;
        }
    }
    
    private void insertInitialData() {
        System.out.println("초기 데이터 삽입 중...");
        
        try {
            // 실제 PasswordEncoder를 사용하여 비밀번호 해시 생성
            String hashedPassword = passwordEncoder.encode("password123");
            System.out.println("생성된 비밀번호 해시: " + hashedPassword);
            
            // 사용자 데이터 삽입 (개별 실행)
            jdbcTemplate.update("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
                "test@example.com", hashedPassword, "Test User", "USER");
            jdbcTemplate.update("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
                "admin@example.com", hashedPassword, "Admin User", "ADMIN");
            jdbcTemplate.update("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
                "user1@example.com", hashedPassword, "User1", "USER");
            jdbcTemplate.update("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
                "user2@example.com", hashedPassword, "User2", "USER");
            
            System.out.println("사용자 데이터 삽입 완료");
            
            // 비밀번호 검증 테스트
            boolean isValid = passwordEncoder.matches("password123", hashedPassword);
            System.out.println("비밀번호 검증 테스트: " + isValid);
            
        } catch (Exception e) {
            System.err.println("사용자 데이터 삽입 실패: " + e.getMessage());
            throw e;
        }
        
        try {
            // 게시글 데이터 삽입 (개별 실행)
            jdbcTemplate.update("INSERT INTO posts (title, content, author_id, author_name, author_email) VALUES (?, ?, ?, ?, ?)",
                "MyBatis와 Spring Boot 연동하기", "MyBatis를 사용하여 Spring Boot 애플리케이션을 개발하는 방법에 대해 알아보겠습니다.", 1, "Test User", "test@example.com");
            jdbcTemplate.update("INSERT INTO posts (title, content, author_id, author_name, author_email) VALUES (?, ?, ?, ?, ?)",
                "React와 Spring Boot 연동", "프론트엔드 React와 백엔드 Spring Boot를 연동하는 방법을 설명합니다.", 1, "Test User", "test@example.com");
            jdbcTemplate.update("INSERT INTO posts (title, content, author_id, author_name, author_email) VALUES (?, ?, ?, ?, ?)",
                "시스템 공지사항", "시스템 업데이트가 완료되었습니다. 새로운 기능들을 확인해보세요.", 2, "Admin User", "admin@example.com");
            jdbcTemplate.update("INSERT INTO posts (title, content, author_id, author_name, author_email) VALUES (?, ?, ?, ?, ?)",
                "개발 가이드라인", "개발 시 준수해야 할 가이드라인입니다.", 2, "Admin User", "admin@example.com");
            jdbcTemplate.update("INSERT INTO posts (title, content, author_id, author_name, author_email) VALUES (?, ?, ?, ?, ?)",
                "프론트엔드 개발 팁", "React 개발 시 유용한 팁들을 공유합니다.", 3, "User1", "user1@example.com");
            
            System.out.println("게시글 데이터 삽입 완료");
            
        } catch (Exception e) {
            System.err.println("게시글 데이터 삽입 실패: " + e.getMessage());
            throw e;
        }
    }
    
    private void verifyTables() {
        System.out.println("테이블 확인 중...");
        
        try {
            // 사용자 수 확인
            Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
            System.out.println("사용자 수: " + userCount);
            
            // 게시글 수 확인
            Integer postCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM posts", Integer.class);
            System.out.println("게시글 수: " + postCount);
            
            // 테이블 구조 확인 (H2 호환)
            System.out.println("테이블 목록:");
            try {
                jdbcTemplate.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC'", (rs) -> {
                    System.out.println("- " + rs.getString(1));
                });
            } catch (Exception e) {
                System.out.println("테이블 목록 조회 실패 (무시): " + e.getMessage());
            }
            
        } catch (Exception e) {
            System.err.println("테이블 확인 중 오류: " + e.getMessage());
        }
    }
}