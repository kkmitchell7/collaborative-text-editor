import React, { useState } from 'react';
import './styles.css'
import { useNavigate } from 'react-router-dom';

const TitleModal = ({ isOpen, onClose }) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const userId = JSON.parse(localStorage.getItem('userId'));
    const token = localStorage.getItem('token');
    
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    

    const navigate = useNavigate();

    async function handleCreateDocument(){
        const createDocument = async (title) => {
            try {
                const response = await fetch(`${backendUrl}/api/documents/`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, title })//title here
                });
                const {newDocumentId} = await response.json();
                return newDocumentId;
            } catch (error) {
                console.error('Error creating document:', error);
                return null;
            }
        };

        if (token && userId) {
            if (title.length > 20) {
                setError('Title must be less than 20 characters');
            } else if (!title) {
                setError('Title is required');
            } else {
                setError('');
                const documentId = await createDocument(title);
                if (documentId) {
                    navigate(`/documents/${documentId}`);
                } else {
                    console.error('Failed to create document');
                }
            }
        }
        
    };

    const handleOnClose = () =>{
        setError('');
        onClose();
    
    }

    return isOpen ? (
        <div className="modal">
            <div className="modal-content">
                <h3>Enter Document Title</h3>
                <input
                    type="text"
                    className="modal-input"
                    maxlength="20"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button onClick={handleOnClose} className="modal-button">Cancel</button>
                <button onClick={handleCreateDocument} className="modal-button">Create</button>
                
            </div>
        </div>
    ) : null;
};


export default TitleModal;