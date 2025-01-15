import './styles.css'
import React, {useState} from 'react'


export default function ShareDocumentModal({isOpen, onClose, documentId}) {
    const [username, setUsername] = useState('');  // State for username input
    const [error, setError] = useState('');

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
                alert(userData.error);
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
                alert('Access granted successfully!');
                handleOnClose(); // Close the modal
            } else {
                alert(updateData.error);
            }
        } catch (error) {
            console.error('Error granting access:', error);
            alert('An error occurred while granting access.');
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
                <button onClick={handleOnClose} className="modal-button">Cancel</button>
                <button onClick={handleShareDocument} className="modal-button">Share</button>
            </div>
        </div>) : null;
}
