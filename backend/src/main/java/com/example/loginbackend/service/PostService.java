package com.example.loginbackend.service;

import com.example.loginbackend.dto.PostRequest;
import com.example.loginbackend.dto.PostResponse;
import com.example.loginbackend.entity.Post;
import com.example.loginbackend.entity.User;
import com.example.loginbackend.mapper.PostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {
    
    @Autowired
    private PostMapper postMapper;
    
    // 게시글 생성
    public PostResponse createPost(PostRequest request, User author) {
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthorId(author.getId());
        post.setAuthorName(author.getName());
        post.setAuthorEmail(author.getEmail());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        
        postMapper.save(post);
        return PostResponse.from(post);
    }
    
    // 게시글 목록 조회 (페이징)
    @Transactional(readOnly = true)
    public PostResponse.PagedResult getAllPosts(int page, int size) {
        int offset = page * size;
        List<Post> posts = postMapper.findAll(offset, size);
        long totalCount = postMapper.countAll();
        int totalPages = (int) Math.ceil((double) totalCount / size);
        
        List<PostResponse> postResponses = posts.stream()
                .map(PostResponse::fromSummary)
                .collect(Collectors.toList());
        
        return new PostResponse.PagedResult(postResponses, page, totalPages, totalCount);
    }
    
    // 게시글 상세 조회 (조회수 증가)
    public Optional<PostResponse> getPostById(Long id) {
        Optional<Post> postOptional = postMapper.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            postMapper.incrementViewCount(id);
            post.incrementViewCount(); // 메모리상 객체도 업데이트
            return Optional.of(PostResponse.from(post));
        }
        return Optional.empty();
    }
    
    // 게시글 수정
    public Optional<PostResponse> updatePost(Long id, PostRequest request, User currentUser) {
        Optional<Post> postOptional = postMapper.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            
            // 작성자 확인
            if (!post.getAuthorId().equals(currentUser.getId())) {
                throw new RuntimeException("게시글 수정 권한이 없습니다");
            }
            
            post.setTitle(request.getTitle());
            post.setContent(request.getContent());
            post.setUpdatedAt(LocalDateTime.now());
            
            postMapper.update(post);
            return Optional.of(PostResponse.from(post));
        }
        return Optional.empty();
    }
    
    // 게시글 삭제
    public boolean deletePost(Long id, User currentUser) {
        Optional<Post> postOptional = postMapper.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            
            // 작성자 확인 (관리자는 모든 게시글 삭제 가능)
            if (!post.getAuthorId().equals(currentUser.getId()) && 
                !currentUser.getRole().equals(User.Role.ADMIN)) {
                throw new RuntimeException("게시글 삭제 권한이 없습니다");
            }
            
            postMapper.deleteById(id);
            return true;
        }
        return false;
    }
    
    // 게시글 검색
    @Transactional(readOnly = true)
    public PostResponse.PagedResult searchPosts(String keyword, int page, int size) {
        int offset = page * size;
        List<Post> posts = postMapper.findByKeyword(keyword, offset, size);
        long totalCount = postMapper.countByKeyword(keyword);
        int totalPages = (int) Math.ceil((double) totalCount / size);
        
        List<PostResponse> postResponses = posts.stream()
                .map(PostResponse::fromSummary)
                .collect(Collectors.toList());
        
        return new PostResponse.PagedResult(postResponses, page, totalPages, totalCount);
    }
    
    // 사용자별 게시글 조회
    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByAuthor(Long authorId) {
        List<Post> posts = postMapper.findByAuthorId(authorId);
        return posts.stream()
                .map(PostResponse::fromSummary)
                .collect(Collectors.toList());
    }
    
    // 게시글 총 개수
    @Transactional(readOnly = true)
    public long getTotalPostCount() {
        return postMapper.countAll();
    }
}