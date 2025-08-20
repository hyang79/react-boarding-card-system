import { useState, useEffect } from 'react'
import { Login, Register } from './components/auth'
import { Board } from './components/board'
import { Modal } from './components/ui'
import BoardingCard from './components/transport/BoardingCard'
import { useModal } from './hooks/useModal'
import './App.css'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userEmail, setUserEmail] = useState('')
    const [currentView, setCurrentView] = useState('login') // 'login', 'register', 'board', 'boarding-card'
    const { modalState, hideModal, handleConfirm, showSuccess } = useModal()

    // 컴포넌트 마운트 시 로그인 상태 확인
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        const email = localStorage.getItem('userEmail')
        if (token && email) {
            setIsLoggedIn(true)
            setUserEmail(email)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userEmail')
        setIsLoggedIn(false)
        setUserEmail('')
        setCurrentView('login')
        showSuccess('로그아웃 완료', '로그아웃되었습니다.')
    }

    const handleLoginSuccess = (email) => {
        setIsLoggedIn(true)
        setUserEmail(email)
        setCurrentView('board')
    }

    const handleRegisterSuccess = (email) => {
        setIsLoggedIn(true)
        setUserEmail(email)
        setCurrentView('board')
    }

    const switchToRegister = () => {
        setCurrentView('register')
    }

    const switchToLogin = () => {
        setCurrentView('login')
    }

    // 로그인된 상태에서의 뷰 렌더링
    if (isLoggedIn) {
        return (
            <>
                <nav className="main-nav">
                    <div className="nav-container">
                        <h1>통합 관리 시스템</h1>
                        <div className="nav-menu">
                            <button 
                                onClick={() => setCurrentView('board')}
                                className={`nav-btn ${currentView === 'board' ? 'active' : ''}`}
                            >
                                게시판
                            </button>
                            <button 
                                onClick={() => setCurrentView('boarding-card')}
                                className={`nav-btn ${currentView === 'boarding-card' ? 'active' : ''}`}
                            >
                                탑승카드
                            </button>
                            <div className="user-info">
                                <span>{userEmail}</span>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="main-content">
                    {currentView === 'board' && (
                        <Board 
                            userEmail={userEmail}
                            onLogout={handleLogout}
                        />
                    )}
                    {currentView === 'boarding-card' && (
                        <BoardingCard />
                    )}
                </main>

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

    // 로그인되지 않은 상태라면 로그인/회원가입 폼 표시
    if (currentView === 'register') {
        return (
            <Register 
                onSwitchToLogin={switchToLogin}
                onRegisterSuccess={handleRegisterSuccess}
            />
        )
    }

    return (
        <Login 
            onSwitchToRegister={switchToRegister}
            onLoginSuccess={handleLoginSuccess}
        />
    )
}

export default App