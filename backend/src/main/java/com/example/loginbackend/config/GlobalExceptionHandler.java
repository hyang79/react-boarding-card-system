package com.example.loginbackend.config;

import com.example.loginbackend.dto.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<LoginResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        System.out.println("=== 유효성 검증 오류 발생 ===");
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
            System.out.println("필드 오류: " + fieldName + " = " + errorMessage);
        });
        
        String errorMessage = "입력값 검증 실패: " + errors.toString();
        System.out.println("전체 오류 메시지: " + errorMessage);
        
        return ResponseEntity.badRequest()
            .body(LoginResponse.failure(errorMessage));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<LoginResponse> handleBindExceptions(BindException ex) {
        System.out.println("=== 바인딩 오류 발생 ===");
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
            System.out.println("바인딩 오류: " + fieldName + " = " + errorMessage);
        });
        
        String errorMessage = "데이터 바인딩 실패: " + errors.toString();
        System.out.println("전체 바인딩 오류: " + errorMessage);
        
        return ResponseEntity.badRequest()
            .body(LoginResponse.failure(errorMessage));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<LoginResponse> handleGenericException(Exception ex) {
        System.out.println("=== 일반 예외 발생 ===");
        System.out.println("예외 타입: " + ex.getClass().getSimpleName());
        System.out.println("예외 메시지: " + ex.getMessage());
        ex.printStackTrace();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(LoginResponse.failure("서버 내부 오류: " + ex.getMessage()));
    }
}