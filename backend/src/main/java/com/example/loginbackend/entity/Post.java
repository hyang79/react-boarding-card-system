package com.example.loginbackend.entity;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

public class Post {
    
    private Long id;
    
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자 이하여야 합니다")
    private String title;
    
    @NotBlank(message = "내용은 필수입니다")
    private String content;
    
    // MyBatis에서는 관계 매핑 대신 직접 필드로 관리
    private Long authorId;
    private String authorName;
    private String authorEmail;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer viewCount = 0;
    
    // Constructors
    public Post() {}
    
    public Post(String title, String content, Long authorId, String authorName, String authorEmail) {
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Long getAuthorId() {
        return authorId;
    }
    
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }
    
    public String getAuthorName() {
        return authorName;
    }
    
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    
    public String getAuthorEmail() {
        return authorEmail;
    }
    
    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Integer getViewCount() {
        return viewCount;
    }
    
    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }
    
    // 조회수 증가
    public void incrementViewCount() {
        this.viewCount++;
    }
}