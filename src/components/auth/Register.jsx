import { useState } from 'react'
import Modal from '../ui/Modal'
import { useModal } from '../../hooks/useModal'

function Register({ onSwitchToLogin, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const { modalState, hideModal, handleConfirm, showSuccess, showError, showConnection } = useModal()

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

        // 이메일 검증
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다'
        }

        // 이름 검증
        if (!formData.name) {
            newErrors.name = '이름을 입력해주세요'
        } else if (formData.name.length < 2) {
            newErrors.name = '이름은 2자 이상이어야 합니다'
        }

        // 비밀번호 검증
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요'
        } else if (formData.password.length < 6) {
            newErrors.password = '비밀번호는 6자 이상이어야 합니다'
        }

        // 비밀번호 확인 검증
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('http://localhost:9090/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok && data.success) {
                showSuccess('회원가입 성공!', `환영합니다, ${formData.name}님!`)
                
                // 토큰을 localStorage에 저장
                localStorage.setItem('authToken', data.token)
                localStorage.setItem('userEmail', data.email)
                
                // 부모 컴포넌트에 성공 알림
                onRegisterSuccess(data.email)
            } else {
                showError('회원가입 실패', data.message || '회원가입에 실패했습니다.')
            }
        } catch (error) {
            console.error('회원가입 오류:', error)
            
            if (error.message.includes('Failed to fetch')) {
                showConnection('서버 연결 실패', '서버에 연결할 수 없습니다.\n서버가 실행 중인지 확인하세요.')
            } else {
                showError('회원가입 오류', '회원가입 중 오류가 발생했습니다.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>회원가입</h1>
                        <p>새 계정을 만들어보세요</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="name">이름</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="이름을 입력하세요"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="이메일을 입력하세요"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="비밀번호를 입력하세요 (6자 이상)"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="비밀번호를 다시 입력하세요"
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? '회원가입 중...' : '회원가입'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            이미 계정이 있으신가요?{' '}
                            <button 
                                type="button"
                                onClick={onSwitchToLogin}
                                className="link-button"
                            >
                                로그인
                            </button>
                        </p>
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
        </>
    )
}

export default Register