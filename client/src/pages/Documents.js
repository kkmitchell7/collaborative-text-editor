import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    //const [user, setUser] = useState(null);
    //const [token, setToken] = useState(null);

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

    async function handleCreateDocument(){
        const createDocument = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/documents/`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                const document = await response.json();
                return document._id;
            } catch (error) {
                console.error('Error creating document:', error);
                return null;
            }
        };

        if (token && userId) {
            
            const documentId = await createDocument();
            navigate(`/documents/${documentId}`);
            
        }
        
    };

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Your Documents</h1>
            <ul>
                {documents.map((doc) => (
                    <li key={doc._id}>{doc._id}</li>
                ))}
            </ul>
            <button onClick={() => handleCreateDocument()}>
                Create New Document 
            </button>
        </div>
    );
}
