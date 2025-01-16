import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import CreateDocumentModal from '../../components/CreateDocumentModal'
import DocumentsGrid from '../../components/DocumentsGrid'
import './styles.css'

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false); //Used to open and close the create document/title modal
    const [selectedOption, setSelectedOption] = useState('All Documents');

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const userId = JSON.parse(localStorage.getItem('userId'));
    const token = localStorage.getItem('token');

    const navigate = useNavigate();
    

    // Fetch documents when the component loads
    useEffect(() => {
        const fetchDocuments = async () => {
            if (selectedOption === 'All Documents'){
                try {
                    const response = await fetch(`${backendUrl}/api/users/${userId}/documents/accessible`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const {documents} = await response.json();
                    setDocuments(documents);
                } catch (error) {
                    console.error('Error fetching all documents:', error);
                }
            } else if (selectedOption === 'My Documents'){
                try {
                    const response = await fetch(`${backendUrl}/api/users/${userId}/documents/owned`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const {documents} = await response.json();
                    setDocuments(documents);
                } catch (error) {
                    console.error('Error fetching my documents:', error);
                }
                
            }else if (selectedOption === 'Shared With Me'){
                try {
                    const response = await fetch(`${backendUrl}/api/users/${userId}/documents/shared`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const {documents} = await response.json();
                    setDocuments(documents);
                } catch (error) {
                    console.error('Error fetching shared with me documents:', error);
                }
            }
            
        };

        if (token && userId && selectedOption) {
            fetchDocuments();
        }
    },[selectedOption, userId, token, backendUrl]);

    const handleLogout = () => {
        // Clear user and token from localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        
        navigate('/login');  // Go to login page
      };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
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
                <h1 className="home-title"> Documents Home</h1>
                <button className="create-doc-button" onClick={() => setModalOpen(true)}>
                    Create New Document 
                </button>

            
            </div>

            <div className="slider-container">
                <button
                    className={`slider-button ${selectedOption === 'All Documents' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('All Documents')}
                >
                    All Documents
                </button>
                <button
                    style={{ borderRight: 'none'}}
                    className={`slider-button ${selectedOption === 'My Documents' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('My Documents')}
                >
                    My Documents
                </button>
                <button
                    className={`slider-button ${selectedOption === 'Shared With Me' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('Shared With Me')}
                >
                    Shared with Me
                </button>
                
            </div>

            
            
            <ul>
                <DocumentsGrid documents={documents} navigate={navigate}/>
            </ul>
            <CreateDocumentModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)} // Close the modal
            />
        </div>
    );
}
