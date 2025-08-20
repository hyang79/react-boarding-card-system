import Modal from '../ui/Modal'
import { useModal } from '../../hooks/useModal'

function ModalDemo() {
    const { 
        modalState, 
        hideModal, 
        handleConfirm, 
        showSuccess, 
        showError, 
        showWarning, 
        showConnection,
        showConfirm 
    } = useModal()

    const handleDeleteConfirm = () => {
        showConfirm(
            '정말 삭제하시겠습니까?',
            '이 작업은 되돌릴 수 없습니다.',
            () => {
                showSuccess('삭제 완료', '항목이 성공적으로 삭제되었습니다.')
            }
        )
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2>모달 시스템 데모</h2>
            <p>다양한 타입의 모달을 테스트해보세요:</p>
            
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <button 
                    onClick={() => showSuccess('성공!', '작업이 성공적으로 완료되었습니다.')}
                    style={{ padding: '0.75rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    성공 모달
                </button>
                
                <button 
                    onClick={() => showError('오류 발생', '예상치 못한 오류가 발생했습니다.')}
                    style={{ padding: '0.75rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    오류 모달
                </button>
                
                <button 
                    onClick={() => showWarning('주의', '이 작업을 계속하시겠습니까?')}
                    style={{ padding: '0.75rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    경고 모달
                </button>
                
                <button 
                    onClick={() => showConnection('연결 실패', '서버에 연결할 수 없습니다.\n네트워크 상태를 확인해주세요.')}
                    style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    연결 모달
                </button>
                
                <button 
                    onClick={handleDeleteConfirm}
                    style={{ padding: '0.75rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    확인 모달
                </button>
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

export default ModalDemo