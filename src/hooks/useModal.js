import { useState } from 'react'

export function useModal() {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        showConfirm: false,
        onConfirm: null,
        confirmText: '확인',
        cancelText: '취소'
    })

    const showModal = ({
        title,
        message,
        type = 'info',
        showConfirm = false,
        onConfirm = null,
        confirmText = '확인',
        cancelText = '취소'
    }) => {
        setModalState({
            isOpen: true,
            title,
            message,
            type,
            showConfirm,
            onConfirm,
            confirmText,
            cancelText
        })
    }

    const hideModal = () => {
        setModalState(prev => ({
            ...prev,
            isOpen: false
        }))
    }

    const handleConfirm = () => {
        if (modalState.onConfirm) {
            modalState.onConfirm()
        }
        hideModal()
    }

    // 편의 메서드들
    const showSuccess = (title, message) => {
        showModal({ title, message, type: 'success' })
    }

    const showError = (title, message) => {
        showModal({ title, message, type: 'error' })
    }

    const showWarning = (title, message) => {
        showModal({ title, message, type: 'warning' })
    }

    const showConnection = (title, message) => {
        showModal({ title, message, type: 'connection' })
    }

    const showConfirm = (title, message, onConfirm) => {
        showModal({ 
            title, 
            message, 
            type: 'warning',
            showConfirm: true, 
            onConfirm 
        })
    }

    return {
        modalState,
        showModal,
        hideModal,
        handleConfirm,
        showSuccess,
        showError,
        showWarning,
        showConnection,
        showConfirm
    }
}