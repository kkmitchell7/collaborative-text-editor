import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import TitleModal from '../../components/TitleModal'
import DocumentsGrid from '../../components/DocumentsGrid'
import './styles.css'

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('All Documents');

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


    const toggleDropdown = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsFilterOpen(false);  // Close the dropdown after selection
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
                    className={`slider-button ${selectedOption === 'Shared with Me' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('Shared with Me')}
                >
                    Shared with Me
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
