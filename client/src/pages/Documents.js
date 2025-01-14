import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import TitleModal from '../components/TitleModal'

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const userId = JSON.parse(localStorage.getItem('userId'));
    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    

    // Fetch documents when the component loads
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/documents/users/${userId}`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setDocuments(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        if (token && userId) {
            fetchDocuments();
        }
    },[]);

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Your Documents</h1>
            <ul>
                {documents.map((doc) => (
                    <button key={doc._id} onClick={() => navigate(`/documents/${doc._id}`)}>{doc.title}</button>
                ))}
            </ul>
            <button onClick={() => setModalOpen(true)}>
                Create New Document 
            </button>
            <TitleModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)} // Close the modal
            />
        </div>
    );
}
