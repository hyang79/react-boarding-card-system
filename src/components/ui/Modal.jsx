import { useEffect } from 'react'
import './Modal.css'

function Modal({ 
    isOpen, 
    onClose, 
    title, 
    message, 
    type = 'info', 
    showConfirm = false, 
    onConfirm,
    confirmText = '확인',
    cancelText = '취소'
}) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '🎉'
            case 'error':
                return '❌'
            case 'warning':
                return '⚠️'
            case 'connection':
                return '🔌'
            case 'loading':
                return '⏳'
            default:
                return 'ℹ️'
        }
    }

    const getTypeClass = () => {
        switch (type) {
            case 'success':
                return 'modal-success'
            case 'error':
                return 'modal-error'
            case 'warning':
                return 'modal-warning'
            case 'connection':
                return 'modal-connection'
            default:
                return 'modal-info'
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${getTypeClass()}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-icon">{getIcon()}</div>
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                </div>
                
                <div className="modal-footer">
                    {showConfirm ? (
                        <>
                            <button className="modal-button modal-button-secondary" onClick={onClose}>
                                {cancelText}
                            </button>
                            <button className="modal-button modal-button-primary" onClick={onConfirm}>
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button className="modal-button modal-button-primary" onClick={onClose}>
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Modal