import { useState, useEffect } from 'react';
import garbageIcon from '../../assets/images/garbage.png';
import '../css/manager.css';
import '../managerModals/css/usersModal.css';

const UsersModal = ({ showModal, setShowModal }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/all');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    useEffect(() => {
        if (showModal) {
            fetchUsers();
        }
    }, [showModal]);

    return (
        showModal && (
            <div className="users-modal-overlay">
                <div className="users-modal">
                    <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                    <div className="users-content">
                        {loading ? (
                            <div>Loading users...</div>
                        ) : error ? (
                            <div>Error: {error}</div>
                        ) : (
                            <div className="users-list">
                                {users.map((user, index) => (
                                    <div key={user._id || index} className="user-item">
                                        <div className="user-info">
                                            <div className="user-name">
                                                <span className="label">NAME: </span>
                                                {user.fullName}
                                            </div>
                                            <div className="user-occupation">
                                                <span className="label">OCCUPATION: </span>
                                                {user.permission}
                                            </div>
                                        </div>
                                        <div className="delete-icon-tooltip">
                                            <img
                                                src={garbageIcon}
                                                alt="delete"
                                                className="delete-icon"
                                                onClick={() => handleDeleteUser(user._id)}
                                                onError={(e) => console.error('Failed to load image:', e)}
                                            />
                                            <span className="tooltiptext">Fire the worker</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default UsersModal;
