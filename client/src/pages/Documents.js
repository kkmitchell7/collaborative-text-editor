import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
    const token = localStorage.getItem('token');

    // Fetch documents when the component loads
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('/api/documents', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setDocuments(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        if (token) {
            fetchDocuments();
        }
    }, [token]);

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Your Documents</h1>
            <ul>
                {documents.map((doc) => (
                    <li key={doc.id}>{doc.name}</li>
                ))}
            </ul>
            <button onClick={() => <Navigate to={`/documents/${uuidV4()}`} />}>
                Create New Document
            </button>
        </div>
    );
}
