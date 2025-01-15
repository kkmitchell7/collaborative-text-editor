import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import TitleModal from '../../components/TitleModal'
import DocumentsGrid from '../../components/DocumentsGrid'
import './styles.css'

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
                const response = await fetch(`${backendUrl}/api/users/${userId}/documents/accessible`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const {documents} = await response.json();
                setDocuments(documents);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        if (token && userId) {
            fetchDocuments();
        }
    },[]);

    const handleLogout = () => {
        // Clear user and token from localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        
        navigate('/login');  // Go to login page
      };

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <div className="logout-button-container">
                <button className="logout-button" onClick={handleLogout}>
                Logout
                </button>
            </div>
            <div className="home-button-title">
                <h1 className="home-title">Your Documents</h1>
                <button className="create-doc-button" onClick={() => setModalOpen(true)}>
                    Create New Document 
                </button>
            </div>
            
            <ul>
                <DocumentsGrid documents={documents} navigate={navigate}/>
            </ul>
            <TitleModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)} // Close the modal
            />
        </div>
    );
}
