import { useState } from 'react'
import '../../styles/common.css'
import './PostList.css'

function PostList({ posts, currentPage, totalPages, searchKeyword, onPostClick, onSearch, onPageChange }) {
    const [keyword, setKeyword] = useState(searchKeyword)

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        onSearch(keyword)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const truncateTitle = (title, maxLength = 80) => {
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
    }

    return (
        <div className="post-list">
            {/* 검색 폼 */}
            <div className="search-section">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="제목 또는 내용으로 검색..."
                        className="input search-input"
                    />
                    <button type="submit" className="btn btn-primary">검색</button>
                    {searchKeyword && (
                        <button 
                            type="button" 
                            onClick={() => {
                                setKeyword('')
                                onSearch('')
                            }}
                            className="btn btn-secondary"
                        >
                            전체보기
                        </button>
                    )}
                </form>
            </div>

            {/* 검색 결과 표시 */}
            {searchKeyword && (
                <div className="search-result">
                    <p>'{searchKeyword}' 검색 결과: {posts.length}개</p>
                </div>
            )}

            {/* 게시글 목록 */}
            <div className="table posts-table">
                <div className="table-header">
                    <div className="col-no">번호</div>
                    <div className="col-title">제목</div>
                    <div className="col-author">작성자</div>
                    <div className="col-date">작성일</div>
                    <div className="col-views">조회수</div>
                </div>
                
                {posts.length === 0 ? (
                    <div className="empty-state">
                        <p>게시글이 없습니다.</p>
                    </div>
                ) : (
                    posts.map((post, index) => (
                        <div 
                            key={post.id} 
                            className="table-row clickable"
                            onClick={() => onPostClick(post.id)}
                        >
                            <div className="col-no">
                                {(currentPage * 10) + index + 1}
                            </div>
                            <div className="col-title">
                                <span 
                                    className="post-title"
                                    title={post.title}
                                >
                                    {truncateTitle(post.title)}
                                </span>
                            </div>
                            <div className="col-author">
                                {post.authorName}
                            </div>
                            <div className="col-date">
                                {formatDate(post.createdAt)}
                            </div>
                            <div className="col-views">
                                {post.viewCount}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="pagination-btn"
                    >
                        이전
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const startPage = Math.max(0, currentPage - 2)
                        const pageNum = startPage + i
                        
                        if (pageNum >= totalPages) return null
                        
                        return (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                            >
                                {pageNum + 1}
                            </button>
                        )
                    })}
                    
                    <button 
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="pagination-btn"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    )
}

export default PostList