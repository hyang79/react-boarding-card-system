import Modal from '../ui/Modal'
import { useModal } from '../../hooks/useModal'

function PostDetail({ post, currentUserEmail, onBack, onEdit, onDelete }) {
    const { modalState, hideModal, handleConfirm, showConfirm } = useModal()
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

    const isAuthor = post.authorEmail === currentUserEmail

    const handleDeleteClick = () => {
        showConfirm(
            '게시글 삭제',
            '정말로 이 게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.',
            onDelete
        )
    }

    return (
        <div className="post-detail">
            <div className="post-header">
                <button onClick={onBack} className="back-btn">← 목록으로</button>
                
                {isAuthor && (
                    <div className="post-actions">
                        <button onClick={onEdit} className="edit-btn">수정</button>
                        <button onClick={handleDeleteClick} className="delete-btn">삭제</button>
                    </div>
                )}
            </div>

            <div className="post-content">
                <div className="post-title-section">
                    <h1 className="post-title">{post.title}</h1>
                    <div className="post-meta">
                        <span className="author">작성자: {post.authorName}</span>
                        <span className="date">작성일: {formatDate(post.createdAt)}</span>
                        {post.updatedAt !== post.createdAt && (
                            <span className="updated">수정일: {formatDate(post.updatedAt)}</span>
                        )}
                        <span className="views">조회수: {post.viewCount}</span>
                    </div>
                </div>

                <div className="post-body">
                    <div className="content">
                        {post.content.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                </div>
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

export default PostDetail