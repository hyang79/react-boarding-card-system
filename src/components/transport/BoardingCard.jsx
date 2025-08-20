import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import './BoardingCard.css'

function BoardingCard() {
    const [cardData, setCardData] = useState({
        employeeId: '',
        employeeName: '',
        department: '',
        busRoute: '',
        boardingTime: '',
        validDate: ''
    })

    const [qrValue, setQrValue] = useState('')
    const [isGenerated, setIsGenerated] = useState(false)
    const [qrGeneratedTime, setQrGeneratedTime] = useState(null)
    const [isExpired, setIsExpired] = useState(false)
    const [remainingTime, setRemainingTime] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [showSecurityWarning, setShowSecurityWarning] = useState(false)

    // 현재 날짜를 기본값으로 설정
    useEffect(() => {
        const today = new Date()
        const formattedDate = today.toISOString().split('T')[0]
        setCardData(prev => ({
            ...prev,
            validDate: formattedDate
        }))
    }, [])

    // QR 코드 보안 기능 (복사 방지)
    useEffect(() => {
        if (!isGenerated) return

        // 보안 경고 표시 함수
        const showWarning = () => {
            setShowSecurityWarning(true)
            setTimeout(() => setShowSecurityWarning(false), 2000)
        }

        // 우클릭 방지
        const preventRightClick = (e) => {
            if (e.target.closest('.qr-container')) {
                e.preventDefault()
                showWarning()
                return false
            }
        }

        // 드래그 방지
        const preventDrag = (e) => {
            if (e.target.closest('.qr-container')) {
                e.preventDefault()
                showWarning()
                return false
            }
        }

        // 선택 방지
        const preventSelect = (e) => {
            if (e.target.closest('.qr-container')) {
                e.preventDefault()
                showWarning()
                return false
            }
        }

        // 키보드 단축키 방지 (Ctrl+S, Ctrl+A, F12 등)
        const preventKeyboardShortcuts = (e) => {
            // F12 (개발자 도구)
            if (e.keyCode === 123) {
                e.preventDefault()
                return false
            }

            // Ctrl+Shift+I (개발자 도구)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault()
                return false
            }

            // Ctrl+Shift+C (요소 검사)
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault()
                return false
            }

            // Ctrl+U (소스 보기)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault()
                return false
            }

            // Ctrl+S (저장)
            if (e.ctrlKey && e.keyCode === 83) {
                if (e.target.closest('.qr-container')) {
                    e.preventDefault()
                    showWarning()
                    return false
                }
            }

            // Ctrl+A (전체 선택)
            if (e.ctrlKey && e.keyCode === 65) {
                if (e.target.closest('.qr-container')) {
                    e.preventDefault()
                    showWarning()
                    return false
                }
            }
        }

        // 개발자 도구 감지
        const detectDevTools = () => {
            const threshold = 160
            if (window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold) {
                // 개발자 도구가 열린 것으로 감지되면 QR 코드 숨김
                const qrContainer = document.querySelector('.qr-container')
                if (qrContainer) {
                    qrContainer.style.filter = 'blur(10px)'
                    qrContainer.style.pointerEvents = 'none'
                }
            } else {
                const qrContainer = document.querySelector('.qr-container')
                if (qrContainer && !isExpired) {
                    qrContainer.style.filter = 'none'
                    qrContainer.style.pointerEvents = 'auto'
                }
            }
        }

        // 이벤트 리스너 등록
        document.addEventListener('contextmenu', preventRightClick)
        document.addEventListener('dragstart', preventDrag)
        document.addEventListener('selectstart', preventSelect)
        document.addEventListener('keydown', preventKeyboardShortcuts)

        // 개발자 도구 감지 (주기적 체크)
        const devToolsInterval = setInterval(detectDevTools, 500)

        // 클린업
        return () => {
            document.removeEventListener('contextmenu', preventRightClick)
            document.removeEventListener('dragstart', preventDrag)
            document.removeEventListener('selectstart', preventSelect)
            document.removeEventListener('keydown', preventKeyboardShortcuts)
            clearInterval(devToolsInterval)
        }
    }, [isGenerated, isExpired])

    // QR 코드 유효시간 체크 (2분)
    useEffect(() => {
        let interval = null

        if (isGenerated && qrGeneratedTime) {
            interval = setInterval(() => {
                const now = Date.now()
                const elapsed = now - qrGeneratedTime
                const fiveMinutes = 2 * 60 * 1000 // 2분을 밀리초로
                const remaining = Math.max(0, fiveMinutes - elapsed)

                setRemainingTime(remaining)

                if (elapsed >= fiveMinutes) {
                    setIsExpired(true)
                    clearInterval(interval)
                }
            }, 1000)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isGenerated, qrGeneratedTime])

    // 남은 시간을 분:초 형태로 포맷
    const formatRemainingTime = (ms) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCardData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const generateQR = () => {
        const now = Date.now()

        // QR 코드에 포함될 데이터 생성
        const qrData = {
            id: cardData.employeeId,
            name: cardData.employeeName,
            dept: cardData.department,
            route: cardData.busRoute,
            time: cardData.boardingTime,
            date: cardData.validDate,
            timestamp: now
        }

        // JSON 문자열로 변환
        const qrString = JSON.stringify(qrData)
        setQrValue(qrString)
        setQrGeneratedTime(now)
        setIsGenerated(true)
        setIsExpired(false)
        setRemainingTime(2 * 60 * 1000) // 2분
    }

    const resetCard = () => {
        setCardData({
            employeeId: '',
            employeeName: '',
            department: '',
            busRoute: '',
            boardingTime: '',
            validDate: new Date().toISOString().split('T')[0]
        })
        setQrValue('')
        setIsGenerated(false)
        setQrGeneratedTime(null)
        setIsExpired(false)
        setRemainingTime(0)
    }

    const refreshQR = async () => {
        setIsRefreshing(true)

        // 새로고침 애니메이션을 위한 짧은 지연
        await new Promise(resolve => setTimeout(resolve, 300))

        // 새로운 타임스탬프로 QR 코드 재생성
        const now = Date.now()

        const qrData = {
            id: cardData.employeeId,
            name: cardData.employeeName,
            dept: cardData.department,
            route: cardData.busRoute,
            time: cardData.boardingTime,
            date: cardData.validDate,
            timestamp: now,
            refreshCount: Math.floor(Math.random() * 1000) // 추가 고유성을 위한 랜덤값
        }

        const qrString = JSON.stringify(qrData)
        setQrValue(qrString)
        setQrGeneratedTime(now)
        setIsExpired(false)
        setRemainingTime(2 * 60 * 1000) // 2분 리셋
        setIsRefreshing(false)
    }

    const downloadQR = () => {
        const svg = document.getElementById('boarding-qr')
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            const pngFile = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.download = `boarding-card-${cardData.employeeId}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }

    return (
        <div className="boarding-card-container">
            {/* 보안 경고 메시지 */}
            {showSecurityWarning && (
                <div className="security-warning show">
                    <h3>⚠️ 보안 경고</h3>
                    <p>QR 코드 복사/저장이 금지되어 있습니다.</p>
                    <p>정당한 사용을 위해 다운로드 버튼을 이용해주세요.</p>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h2>통근버스 탑승카드 생성</h2>
                </div>

                <div className="card-body">
                    {!isGenerated ? (
                        <div className="form-section">
                            <div className="form-group">
                                <label className="form-label">사원번호</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={cardData.employeeId}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="예: EMP001"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">성명</label>
                                <input
                                    type="text"
                                    name="employeeName"
                                    value={cardData.employeeName}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="홍길동"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">부서</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={cardData.department}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="개발팀"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">버스 노선</label>
                                <select
                                    name="busRoute"
                                    value={cardData.busRoute}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                >
                                    <option value="">노선 선택</option>
                                    <option value="A노선">A노선 (강남-판교)</option>
                                    <option value="B노선">B노선 (홍대-판교)</option>
                                    <option value="C노선">C노선 (잠실-판교)</option>
                                    <option value="D노선">D노선 (인천-판교)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">탑승 시간</label>
                                <input
                                    type="time"
                                    name="boardingTime"
                                    value={cardData.boardingTime}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">유효 날짜</label>
                                <input
                                    type="date"
                                    name="validDate"
                                    value={cardData.validDate}
                                    onChange={handleInputChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <button
                                onClick={generateQR}
                                className="btn btn-primary"
                                disabled={!cardData.employeeId || !cardData.employeeName || !cardData.busRoute}
                            >
                                QR 코드 생성
                            </button>
                        </div>
                    ) : (
                        <div className="qr-section">
                            {/* 유효시간 표시 */}
                            <div className="validity-info">
                                {!isExpired ? (
                                    <div className={`time-remaining ${remainingTime < 60000 ? 'warning' : ''}`}>
                                        <span className="time-label">유효시간 남음:</span>
                                        <span className="time-value">{formatRemainingTime(remainingTime)}</span>
                                    </div>
                                ) : (
                                    <div className="expired-notice">
                                        <span className="expired-text">QR 코드가 만료되었습니다</span>
                                    </div>
                                )}
                            </div>

                            <div className={`boarding-card ${isExpired ? 'expired' : ''}`}>
                                <div className="card-info">
                                    <h3>통근버스 탑승카드</h3>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="label">사원번호:</span>
                                            <span className="value">{cardData.employeeId}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">성명:</span>
                                            <span className="value">{cardData.employeeName}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">부서:</span>
                                            <span className="value">{cardData.department}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">노선:</span>
                                            <span className="value">{cardData.busRoute}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">시간:</span>
                                            <span className="value">{cardData.boardingTime}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">날짜:</span>
                                            <span className="value">{cardData.validDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`qr-container ${isExpired ? 'expired' : ''}`}>
                                    {/* 워터마크 */}
                                    <div className="qr-watermark">
                                        <span>{cardData.employeeId}</span>
                                        <span>{new Date().toLocaleTimeString()}</span>
                                    </div>

                                    <QRCode
                                        id="boarding-qr"
                                        value={qrValue}
                                        size={200}
                                        level="M"
                                        includeMargin={true}
                                    />
                                    {isExpired && (
                                        <div className="expired-overlay">
                                            <div className="expired-message">
                                                <span>만료됨</span>
                                                <button
                                                    onClick={refreshQR}
                                                    className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
                                                    title="QR 코드 새로고침"
                                                >
                                                    {isRefreshing ? '⏳' : '🔄'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button
                                    onClick={downloadQR}
                                    className="btn btn-success"
                                    disabled={isExpired}
                                >
                                    QR 코드 다운로드
                                </button>
                                {isExpired ? (
                                    <button
                                        onClick={refreshQR}
                                        className="btn btn-primary"
                                        disabled={isRefreshing}
                                    >
                                        {isRefreshing ? '새로고침 중...' : 'QR 새로고침'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={resetCard}
                                        className="btn btn-secondary"
                                    >
                                        새로 만들기
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BoardingCard