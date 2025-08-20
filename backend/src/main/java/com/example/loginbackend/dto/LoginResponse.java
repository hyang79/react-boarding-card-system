package com.example.loginbackend.dto;

public class LoginResponse {
    
    private String token;
    private String email;
    private String message;
    private boolean success;
    
    // Constructors
    public LoginResponse() {}
    
    public LoginResponse(String token, String email, String message, boolean success) {
        this.token = token;
        this.email = email;
        this.message = message;
        this.success = success;
    }
    
    public static LoginResponse success(String token, String email) {
        return new LoginResponse(token, email, "로그인 성공", true);
    }
    
    public static LoginResponse failure(String message) {
        return new LoginResponse(null, null, message, false);
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
}