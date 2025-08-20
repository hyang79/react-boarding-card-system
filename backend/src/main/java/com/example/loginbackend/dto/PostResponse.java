package com.example.loginbackend.dto;

import com.example.loginbackend.entity.Post;
import java.time.LocalDateTime;
import java.util.List;

public class PostResponse {
    
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private String authorEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer viewCount;
    
    // Constructors
    public PostResponse() {}
    
    public PostResponse(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.authorName = post.getAuthorName();
        this.authorEmail = post.getAuthorEmail();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
        this.viewCount = post.getViewCount();
    }
    
    // 목록용 생성자 (내용 제외)
    public PostResponse(Long id, String title, String authorName, String authorEmail, 
                       LocalDateTime createdAt, Integer viewCount) {
        this.id = id;
        this.title = title;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.createdAt = createdAt;
        this.viewCount = viewCount;
    }
    
    // Static factory methods
    public static PostResponse from(Post post) {
        return new PostResponse(post);
    }
    
    public static PostResponse fromSummary(Post post) {
        return new PostResponse(
            post.getId(),
            post.getTitle(),
            post.getAuthorName(),
            post.getAuthorEmail(),
            post.getCreatedAt(),
            post.getViewCount()
        );
    }
    
    // 페이징 결과를 위한 내부 클래스
    public static class PagedResult {
        private List<PostResponse> posts;
        private int currentPage;
        private int totalPages;
        private long totalCount;
        
        public PagedResult(List<PostResponse> posts, int currentPage, int totalPages, long totalCount) {
            this.posts = posts;
            this.currentPage = currentPage;
            this.totalPages = totalPages;
            this.totalCount = totalCount;
        }
        
        // Getters
        public List<PostResponse> getPosts() { return posts; }
        public int getCurrentPage() { return currentPage; }
        public int getTotalPages() { return totalPages; }
        public long getTotalCount() { return totalCount; }
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
}