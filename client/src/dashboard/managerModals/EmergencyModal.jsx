import { useEffect, useState } from 'react';
import '../managerModals/css/emergencyModal.css'

const EmergencyModal = ({ showModal, setShowModal }) => {
    const [status, setStatus] = useState(() => localStorage.getItem('emergencyStatus') || 'all-clear');

    useEffect(() => {
        const handler = (e) => {
            const next = e?.detail?.status || localStorage.getItem('emergencyStatus') || 'all-clear';
            setStatus(next);
        };
        window.addEventListener('emergency-status-change', handler);
        return () => window.removeEventListener('emergency-status-change', handler);
    }, []);

    const declareAllClear = () => {
        try {
            localStorage.setItem('emergencyStatus', 'all-clear');
            setStatus('all-clear');
            window.dispatchEvent(new CustomEvent('emergency-status-change', { detail: { status: 'all-clear' } }));
        } catch (e) {
            console.error('Failed to reset emergency:', e);
        }
    };

    if (!showModal) return null;

    return (
        <div className="modal-content-emergency-modal">
            <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
            <h2 className="emergency-modal-title">Emergency Status</h2>
            {status === 'declared' ? (
                <>
                    <div className="emergency-status emergency-status--declared">Emergency has declared</div>
                    <button className="all-clear-button" onClick={declareAllClear}>All Clear</button>
                </>
            ) : (
                <div className="emergency-status">Emergency status: <br/> all clear</div>
            )}
        </div>
    );
};

export default EmergencyModal;