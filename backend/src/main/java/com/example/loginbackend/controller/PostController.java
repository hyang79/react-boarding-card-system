package com.example.loginbackend.controller;

import com.example.loginbackend.dto.PostRequest;
import com.example.loginbackend.dto.PostResponse;
import com.example.loginbackend.entity.User;
import com.example.loginbackend.service.PostService;
import com.example.loginbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @Autowired
    private UserService userService;
    
    // 현재 로그인한 사용자 정보 가져오기
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
    
    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            PostResponse.PagedResult result = postService.getAllPosts(page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("posts", result.getPosts());
            response.put("currentPage", result.getCurrentPage());
            response.put("totalPages", result.getTotalPages());
            response.put("totalElements", result.getTotalCount());
            response.put("hasNext", result.getCurrentPage() < result.getTotalPages() - 1);
            response.put("hasPrevious", result.getCurrentPage() > 0);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글 목록을 불러오는 중 오류가 발생했습니다");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // 게시글 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable Long id) {
        try {
            Optional<PostResponse> post = postService.getPostById(id);
            if (post.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("post", post.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "게시글을 찾을 수 없습니다");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글을 불러오는 중 오류가 발생했습니다");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // 게시글 생성
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(@Valid @RequestBody PostRequest request) {
        try {
            User currentUser = getCurrentUser();
            PostResponse createdPost = postService.createPost(request, currentUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("post", createdPost);
            response.put("message", "게시글이 성공적으로 작성되었습니다");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePost(
            @PathVariable Long id, 
            @Valid @RequestBody PostRequest request) {
        try {
            User currentUser = getCurrentUser();
            Optional<PostResponse> updatedPost = postService.updatePost(id, request, currentUser);
            
            if (updatedPost.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("post", updatedPost.get());
                response.put("message", "게시글이 성공적으로 수정되었습니다");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "게시글을 찾을 수 없습니다");
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글 수정 중 오류가 발생했습니다");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            boolean deleted = postService.deletePost(id, currentUser);
            
            Map<String, Object> response = new HashMap<>();
            if (deleted) {
                response.put("message", "게시글이 성공적으로 삭제되었습니다");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "게시글을 찾을 수 없습니다");
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글 삭제 중 오류가 발생했습니다");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // 게시글 검색
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            PostResponse.PagedResult result = postService.searchPosts(keyword, page, size);
            
            Map<String, Object> response = new HashMap<>();
            response.put("posts", result.getPosts());
            response.put("currentPage", result.getCurrentPage());
            response.put("totalPages", result.getTotalPages());
            response.put("totalElements", result.getTotalCount());
            response.put("hasNext", result.getCurrentPage() < result.getTotalPages() - 1);
            response.put("hasPrevious", result.getCurrentPage() > 0);
            response.put("keyword", keyword);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "게시글 검색 중 오류가 발생했습니다");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // 내 게시글 조회
    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyPosts() {
        try {
            User currentUser = getCurrentUser();
            List<PostResponse> posts = postService.getPostsByAuthor(currentUser.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("posts", posts);
            response.put("totalElements", posts.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "내 게시글을 불러오는 중 오류가 발생했습니다");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}