import { useState, useEffect } from 'react'
import PostList from './PostList'
import PostDetail from './PostDetail'
import PostForm from './PostForm'
import Modal from '../ui/Modal'
import { useModal } from '../../hooks/useModal'

function Board({ userEmail, onLogout }) {
    const [currentView, setCurrentView] = useState('list') // 'list', 'detail', 'create', 'edit'
    const [selectedPost, setSelectedPost] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [searchKeyword, setSearchKeyword] = useState('')
    const { modalState, hideModal, handleConfirm, showSuccess, showError } = useModal()

    // API 호출 헬퍼 함수
    const apiCall = async (url, options = {}) => {
        const token = localStorage.getItem('authToken')
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        
        const response = await fetch(`http://localhost:9090/api${url}`, {
            ...defaultOptions,
            ...options,
            headers: { ...defaultOptions.headers, ...options.headers }
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        return response.json()
    }

    // 게시글 목록 로드
    const loadPosts = async (page = 0, keyword = '') => {
        setLoading(true)
        try {
            let url = `/posts?page=${page}&size=10`
            if (keyword) {
                url = `/posts/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=10`
            }
            
            const data = await apiCall(url)
            setPosts(data.posts)
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.error('게시글 로드 오류:', error)
            showError('로드 오류', '게시글을 불러오는 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    // 게시글 상세 조회
    const loadPostDetail = async (postId) => {
        setLoading(true)
        try {
            const data = await apiCall(`/posts/${postId}`)
            setSelectedPost(data.post)
            setCurrentView('detail')
        } catch (error) {
            console.error('게시글 상세 조회 오류:', error)
            showError('로드 오류', '게시글을 불러오는 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    // 게시글 생성
    const createPost = async (postData) => {
        try {
            await apiCall('/posts', {
                method: 'POST',
                body: JSON.stringify(postData)
            })
            showSuccess('작성 완료', '게시글이 성공적으로 작성되었습니다.')
            setCurrentView('list')
            loadPosts(0, searchKeyword)
        } catch (error) {
            console.error('게시글 작성 오류:', error)
            showError('작성 오류', '게시글 작성 중 오류가 발생했습니다.')
        }
    }

    // 게시글 수정
    const updatePost = async (postId, postData) => {
        try {
            await apiCall(`/posts/${postId}`, {
                method: 'PUT',
                body: JSON.stringify(postData)
            })
            showSuccess('수정 완료', '게시글이 성공적으로 수정되었습니다.')
            setCurrentView('detail')
            loadPostDetail(postId)
        } catch (error) {
            console.error('게시글 수정 오류:', error)
            showError('수정 오류', '게시글 수정 중 오류가 발생했습니다.')
        }
    }

    // 게시글 삭제 (PostDetail에서 이미 확인했으므로 바로 실행)
    const deletePost = async (postId) => {
        try {
            await apiCall(`/posts/${postId}`, {
                method: 'DELETE'
            })
            showSuccess('삭제 완료', '게시글이 성공적으로 삭제되었습니다.')
            setCurrentView('list')
            loadPosts(0, searchKeyword)
        } catch (error) {
            console.error('게시글 삭제 오류:', error)
            showError('삭제 오류', '게시글 삭제 중 오류가 발생했습니다.')
        }
    }

    // 검색
    const handleSearch = (keyword) => {
        setSearchKeyword(keyword)
        setCurrentPage(0)
        loadPosts(0, keyword)
    }

    // 페이지 변경
    const handlePageChange = (page) => {
        setCurrentPage(page)
        loadPosts(page, searchKeyword)
    }

    // 초기 로드
    useEffect(() => {
        loadPosts()
    }, [])

    return (
        <div className="board-container">
            <div className="board-header">
                <div className="board-title">
                    <h1>게시판</h1>
                    <div className="user-info">
                        <span>환영합니다, {userEmail}님!</span>
                        <button onClick={onLogout} className="logout-btn">로그아웃</button>
                    </div>
                </div>
                
                {currentView === 'list' && (
                    <div className="board-actions">
                        <button 
                            onClick={() => setCurrentView('create')}
                            className="create-btn"
                        >
                            글쓰기
                        </button>
                    </div>
                )}
            </div>

            <div className="board-content">
                {loading && <div className="loading">로딩 중...</div>}
                
                {currentView === 'list' && (
                    <PostList
                        posts={posts}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        searchKeyword={searchKeyword}
                        onPostClick={loadPostDetail}
                        onSearch={handleSearch}
                        onPageChange={handlePageChange}
                    />
                )}
                
                {currentView === 'detail' && selectedPost && (
                    <PostDetail
                        post={selectedPost}
                        currentUserEmail={userEmail}
                        onBack={() => setCurrentView('list')}
                        onEdit={() => setCurrentView('edit')}
                        onDelete={() => deletePost(selectedPost.id)}
                    />
                )}
                
                {(currentView === 'create' || currentView === 'edit') && (
                    <PostForm
                        post={currentView === 'edit' ? selectedPost : null}
                        onSubmit={currentView === 'edit' 
                            ? (data) => updatePost(selectedPost.id, data)
                            : createPost
                        }
                        onCancel={() => setCurrentView(currentView === 'edit' ? 'detail' : 'list')}
                    />
                )}
            </div>

            <Modal
                isOpen={modalState.isOpen}
                onClose={hideModal}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                showConfirm={modalState.showConfirm}
                onConfirm={handleConfirm}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
            />
        </div>
    )
}

export default Board