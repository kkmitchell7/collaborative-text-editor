import './styles.css'
import React, {useState} from 'react'


export default function ShareDocumentModal({isOpen, onClose, documentId}) {
    const [username, setUsername] = useState('');  // State for username input
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Handle input change for username
    const handleUsernameChange = (e) => setUsername(e.target.value);
    
    const handleOnClose = () =>{
        setError('');
        onClose();
    
    }
    
    const handleShareDocument = async () => {
        try {
           
            const userResponse = await fetch(`http://localhost:3001/api/users/ID/${username}`);
            const userData = await userResponse.json();

            if (userResponse.status !== 200) {
                setError(userData.error);
                return;
            }

            const userId = userData.userId;

            
            const updateResponse = await fetch(`http://localhost:3001/api/documents/${documentId}/access`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const updateData = await updateResponse.json();

            if (updateResponse.status === 200) {
                setMessage('Access granted successfully!');
                handleOnClose(); // Close the modal
            } else if (updateData.error === `User with ID: ${userId} already has access to the document`) {
                setError(`${username} already has access to the document`);
            } else {
                setError('Something went wrong on our end');
            }
        } catch (error) {
            console.error('Error granting access:', error);
            setError('An error occurred while granting access.');
        }
    };

    

    return isOpen ? (
        <div className="modal">
            <div className="modal-content">
                <h3>Share Document</h3>
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Enter Username"
                />
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                <button onClick={handleOnClose} className="modal-button">Cancel</button>
                <button onClick={handleShareDocument} className="modal-button">Share</button>
            </div>
        </div>) : null;
}
