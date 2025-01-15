import React, {useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import './styles.css'
import ShareDocumentModal from '../ShareDocumentModal'

export default function DocumentIcon({title, id }) {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [isModalOpen, setModalOpen] = useState(false);

    const deleteDocument = async () => {
      try {
          const response = await fetch(`${backendUrl}/api/documents/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
          console.log('Document deleted:', response.data);
          window.location.reload();
      } catch (error) {
          console.error('Error deleting document:', error);
      }
  };

  return (
    <div className="document-icon-container">
      <button
        className="document-icon-button"
        onClick={() => navigate(`/documents/${id}`)}
      >
        <div className="document-icon">
        <i class="fas fa-edit fa-3x"></i>
        </div>
        <div className="document-title">{title}</div>
      </button>
      <button
          className="document-delete-button"
          onClick={deleteDocument} // Calls the delete function
        >
        <i className="fas fa-trash-alt"></i> 
      </button>
      <button className="document-share-button" onClick={() => setModalOpen(true)}>Share</button>
      

      
      <ShareDocumentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} documentId={id}/>
    </div>
  )
}
