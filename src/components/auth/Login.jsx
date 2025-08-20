import { useState } from 'react'
import Modal from '../ui/Modal'
import { useModal } from '../../hooks/useModal'

function Login({ onSwitchToRegister, onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const { modalState, hideModal, handleConfirm, showSuccess, showError, showConnection } = useModal()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const testBackendConnection = async () => {
        try {
            console.log('백엔드 연결 테스트 시작...')
            const response = await fetch('http://localhost:9090/api/auth/test', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            console.log('테스트 응답 상태:', response.status)

            if (response.ok) {
                const data = await response.text()
                showSuccess('백엔드 연결 성공!', `응답: ${data}`)
                console.log('백엔드 테스트 응답:', data)
            } else {
                showError('백엔드 연결 실패', `상태 코드: ${response.status}`)
            }
        } catch (error) {
            console.error('백엔드 연결 오류:', error)
            showConnection('백엔드 서버 연결 실패', '서버가 http://localhost:9090 에서 실행 중인지 확인하세요.')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        // 입력값 검증
        if (!formData.email || !formData.password) {
            showError('입력 오류', '이메일과 비밀번호를 모두 입력해주세요.')
            setIsLoading(false)
            return
        }

        console.log('로그인 시도:', { email: formData.email, password: '***' })

        try {
            const response = await fetch('http://localhost:9090/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })

            console.log('응답 상태:', response.status)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('서버 응답:', data)

            if (data.success) {
                showSuccess('로그인 성공!', `환영합니다, ${data.email}님!`)
                console.log('JWT 토큰:', data.token)

                // 토큰을 localStorage에 저장
                localStorage.setItem('authToken', data.token)
                localStorage.setItem('userEmail', data.email)

                // 부모 컴포넌트에 성공 알림
                onLoginSuccess(data.email)

                // 로그인 성공 후 폼 초기화
                setFormData({ email: '', password: '' })
            } else {
                showError('로그인 실패', data.message || '로그인에 실패했습니다.')
            }
        } catch (error) {
            console.error('로그인 오류:', error)

            if (error.message.includes('Failed to fetch')) {
                showConnection('백엔드 서버 연결 실패', '서버가 실행 중인지 확인하세요.\n(http://localhost:9090)')
            } else if (error.message.includes('HTTP error')) {
                showError('서버 오류', '서버에서 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.')
            } else {
                showError('알 수 없는 오류', '알 수 없는 오류가 발생했습니다.')
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
                        <h1>로그인</h1>
                        <p>계정에 로그인하세요</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">이메일</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="이메일을 입력하세요"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">비밀번호</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <button
                            type="button"
                            onClick={testBackendConnection}
                            className="test-button"
                            style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                marginBottom: '1rem',
                                fontSize: '0.875rem'
                            }}
                        >
                            백엔드 연결 테스트
                        </button>
                        <br />
                        <a href="#" className="forgot-password">비밀번호를 잊으셨나요?</a>
                        <p>
                            계정이 없으신가요?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="link-button"
                            >
                                회원가입
                            </button>
                        </p>
                        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                            <p>테스트 계정:</p>
                            <p>test@example.com / password123</p>
                            <p>admin@example.com / password123</p>
                        </div>
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

export default Login