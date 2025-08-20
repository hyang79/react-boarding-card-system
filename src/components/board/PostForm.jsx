import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import { useModal } from '../../hooks/useModal'

function PostForm({ post, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { modalState, hideModal, handleConfirm, showError } = useModal()

    // 수정 모드일 때 기존 데이터 로드
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                content: post.content
            })
        }
    }, [post])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // 실시간 에러 제거
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = '제목을 입력해주세요'
        } else if (formData.title.length > 200) {
            newErrors.title = '제목은 200자 이하여야 합니다'
        }

        if (!formData.content.trim()) {
            newErrors.content = '내용을 입력해주세요'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            const errorMessages = Object.values(errors).filter(msg => msg)
            if (errorMessages.length > 0) {
                showError('입력 오류', errorMessages.join('\n'))
            }
            return
        }

        setIsLoading(true)
        try {
            await onSubmit({
                title: formData.title.trim(),
                content: formData.content.trim()
            })
        } catch (error) {
            console.error('폼 제출 오류:', error)
            showError('제출 오류', '폼 제출 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="post-form">
            <div className="form-header">
                <h2>{post ? '게시글 수정' : '새 게시글 작성'}</h2>
                <button onClick={onCancel} className="cancel-btn">취소</button>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="제목을 입력하세요"
                        className={errors.title ? 'error' : ''}
                        maxLength={200}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                    <div className="char-count">
                        {formData.title.length}/200
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="내용을 입력하세요"
                        className={errors.content ? 'error' : ''}
                        rows={15}
                    />
                    {errors.content && <span className="error-message">{errors.content}</span>}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? '저장 중...' : (post ? '수정하기' : '작성하기')}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="cancel-btn"
                        disabled={isLoading}
                    >
                        취소
                    </button>
                </div>
            </form>

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

export default PostForm