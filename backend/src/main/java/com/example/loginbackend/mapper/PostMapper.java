package com.example.loginbackend.mapper;

import com.example.loginbackend.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface PostMapper {
    
    /**
     * 게시글 목록 조회 (페이징)
     */
    List<Post> findAll(@Param("offset") int offset, @Param("size") int size);
    
    /**
     * 전체 게시글 수 조회
     */
    long countAll();
    
    /**
     * 키워드로 게시글 검색 (페이징)
     */
    List<Post> findByKeyword(@Param("keyword") String keyword, 
                            @Param("offset") int offset, 
                            @Param("size") int size);
    
    /**
     * 키워드로 검색된 게시글 수 조회
     */
    long countByKeyword(@Param("keyword") String keyword);
    
    /**
     * ID로 게시글 조회
     */
    Optional<Post> findById(@Param("id") Long id);
    
    /**
     * 게시글 저장
     */
    void save(Post post);
    
    /**
     * 게시글 업데이트
     */
    void update(Post post);
    
    /**
     * 게시글 삭제
     */
    void deleteById(@Param("id") Long id);
    
    /**
     * 조회수 증가
     */
    void incrementViewCount(@Param("id") Long id);
    
    /**
     * 작성자 ID로 게시글 목록 조회
     */
    List<Post> findByAuthorId(@Param("authorId") Long authorId);
}