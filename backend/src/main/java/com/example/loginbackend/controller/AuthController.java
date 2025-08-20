package com.example.loginbackend.controller;

import com.example.loginbackend.dto.LoginRequest;
import com.example.loginbackend.dto.LoginResponse;
import com.example.loginbackend.dto.RegisterRequest;
import com.example.loginbackend.entity.User;
import com.example.loginbackend.service.JwtService;
import com.example.loginbackend.service.UserService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("=== 로그인 요청 시작 ===");
            System.out.println("요청 이메일: " + (loginRequest != null ? loginRequest.getEmail() : "null"));
            System.out.println("요청 비밀번호 길이: " + (loginRequest != null && loginRequest.getPassword() != null ? loginRequest.getPassword().length() : "null"));
            
            if (loginRequest == null) {
                System.out.println("LoginRequest가 null입니다");
                return ResponseEntity.badRequest()
                    .body(LoginResponse.failure("요청 데이터가 없습니다"));
            }
            
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                System.out.println("이메일이 비어있습니다");
                return ResponseEntity.badRequest()
                    .body(LoginResponse.failure("이메일을 입력해주세요"));
            }
            
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                System.out.println("비밀번호가 비어있습니다");
                return ResponseEntity.badRequest()
                    .body(LoginResponse.failure("비밀번호를 입력해주세요"));
            }
            
            System.out.println("로그인 시도: " + loginRequest.getEmail());
            
            // 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            System.out.println("인증 성공: " + authentication.getName());
            
            // 사용자 정보 조회
            Optional<User> userOptional = userService.findByEmail(loginRequest.getEmail());
            if (userOptional.isEmpty()) {
                System.out.println("사용자를 찾을 수 없음: " + loginRequest.getEmail());
                return ResponseEntity.badRequest()
                    .body(LoginResponse.failure("사용자를 찾을 수 없습니다"));
            }
            
            User user = userOptional.get();
            System.out.println("사용자 조회 성공: " + user.getEmail() + ", Role: " + user.getRole());
            
            // JWT 토큰 생성
            String token = jwtService.generateToken(user);
            System.out.println("JWT 토큰 생성 완료");
            System.out.println("=== 로그인 요청 완료 ===");
            
            return ResponseEntity.ok(LoginResponse.success(token, user.getEmail()));
            
        } catch (BadCredentialsException e) {
            System.out.println("인증 실패: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body(LoginResponse.failure("이메일 또는 비밀번호가 올바르지 않습니다"));
        } catch (Exception e) {
            System.out.println("로그인 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(LoginResponse.failure("로그인 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // 비밀번호 일치 검증
            if (!registerRequest.isPasswordMatching()) {
                return ResponseEntity.badRequest()
                    .body(LoginResponse.failure("비밀번호가 일치하지 않습니다"));
            }
            
            // 사용자 생성
            User user = userService.createUser(
                registerRequest.getEmail(), 
                registerRequest.getPassword(),
                registerRequest.getName()
            );
            
            // JWT 토큰 생성
            String token = jwtService.generateToken(user);
            
            return ResponseEntity.ok(LoginResponse.success(token, user.getEmail()));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(LoginResponse.failure(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(LoginResponse.failure("회원가입 중 오류가 발생했습니다"));
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("백엔드 서버가 정상적으로 작동중입니다!");
    }
    
    @GetMapping("/hash-password")
    public ResponseEntity<String> hashPassword(@RequestParam String password) {
        try {
            String hashedPassword = userService.hashPassword(password);
            return ResponseEntity.ok("Original: " + password + "\nHashed: " + hashedPassword);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/verify-password")
    public ResponseEntity<String> verifyPassword(@RequestParam String email, @RequestParam String password) {
        try {
            System.out.println("비밀번호 검증 테스트: " + email + " / " + password);
            
            Optional<User> userOptional = userService.findByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("사용자를 찾을 수 없습니다: " + email);
            }
            
            User user = userOptional.get();
            String storedHash = user.getPassword();
            boolean isValid = userService.validatePassword(password, storedHash);
            
            String result = String.format(
                "이메일: %s\n입력 비밀번호: %s\n저장된 해시: %s\n검증 결과: %s",
                email, password, storedHash, isValid
            );
            
            System.out.println("비밀번호 검증 결과: " + isValid);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            System.err.println("비밀번호 검증 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/db-status")
    public ResponseEntity<String> checkDatabaseStatus() {
        try {
            System.out.println("데이터베이스 상태 확인 시작...");
            
            // 간단한 데이터베이스 상태 확인
            Optional<User> testUser = userService.findByEmail("test@example.com");
            if (testUser.isPresent()) {
                User user = testUser.get();
                String result = String.format("데이터베이스 연결 정상.\n테스트 사용자: %s (%s, %s)", 
                    user.getName(), user.getEmail(), user.getRole());
                System.out.println("DB 상태 확인 성공: " + result);
                return ResponseEntity.ok(result);
            } else {
                System.out.println("테스트 사용자를 찾을 수 없음");
                return ResponseEntity.ok("데이터베이스 연결 정상. 테스트 사용자 없음.");
            }
        } catch (Exception e) {
            System.err.println("데이터베이스 연결 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("데이터베이스 연결 오류: " + e.getMessage());
        }
    }
    
    @GetMapping("/test-user")
    public ResponseEntity<String> testUserLoad() {
        try {
            System.out.println("사용자 로드 테스트 시작...");
            
            // UserDetailsService를 통한 사용자 로드 테스트
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                userService.loadUserByUsername("test@example.com");
            
            String result = String.format("사용자 로드 성공: %s, 권한: %s", 
                userDetails.getUsername(), userDetails.getAuthorities());
            System.out.println(result);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            System.err.println("사용자 로드 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("사용자 로드 실패: " + e.getMessage());
        }
    }
    
    @PostMapping("/test-login")
    public ResponseEntity<String> testLogin(@RequestBody String rawBody) {
        System.out.println("=== 테스트 로그인 요청 ===");
        System.out.println("Raw Body: " + rawBody);
        System.out.println("Content-Type: " + "application/json");
        
        try {
            // JSON 파싱 테스트
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            LoginRequest loginRequest = mapper.readValue(rawBody, LoginRequest.class);
            
            System.out.println("파싱된 이메일: " + loginRequest.getEmail());
            System.out.println("파싱된 비밀번호 길이: " + (loginRequest.getPassword() != null ? loginRequest.getPassword().length() : "null"));
            
            return ResponseEntity.ok("테스트 로그인 요청 파싱 성공");
            
        } catch (Exception e) {
            System.err.println("테스트 로그인 파싱 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("파싱 실패: " + e.getMessage());
        }
    }
}