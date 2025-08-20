package com.example.loginbackend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.loginbackend.mapper")
public class LoginBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoginBackendApplication.class, args);
    }
}