import React, { useState } from 'react';
import './styles.css'
import { Navigate, useNavigate } from 'react-router-dom';

const TitleModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const userId = JSON.parse(localStorage.getItem('userId'));
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    async function handleCreateDocument(){
        const createDocument = async (title) => {
            try {
                const response = await fetch(`${backendUrl}/api/documents/`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, title })//title here
                });
                const document = await response.json();
                return document._id;
            } catch (error) {
                console.error('Error creating document:', error);
                return null;
            }
        };

        if (token && userId) {
            
            const documentId = await createDocument(title);
            if (documentId) {
                navigate(`/documents/${documentId}`);
            } else {
                console.error('Failed to create document');
            }
            
        }
        
    };

    return isOpen ? (
        <div className="modal">
            <div className="modal-content">
                <h3>Enter Document Title</h3>
                <input
                    type="text"
                    className="modal-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                />
                <button onClick={handleCreateDocument} className="modal-button">Submit</button>
                <button onClick={onClose} className="modal-button">Cancel</button>
            </div>
        </div>
    ) : null;
};


export default TitleModal;