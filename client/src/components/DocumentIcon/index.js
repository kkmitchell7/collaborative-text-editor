import React, {useState} from 'react'
import './styles.css'
import ShareDocumentModal from '../ShareDocumentModal'
import moment from 'moment';


export default function DocumentIcon({title, id, navigate, isOwner,lastUpdated }) {
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const [isModalOpen, setModalOpen] = useState(false); //used to open the share document modal

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
      {isOwner && (
        <>
          <button
            className="document-delete-button"
            onClick={deleteDocument} // Calls the delete document function
          >
            <i className="fas fa-trash-alt"></i> 
          </button>
          <button className="document-share-button" onClick={() => setModalOpen(true)}>
            Share
          </button>
        </>
      )}
      <p className="last-updated-text">
        Edited: {moment(lastUpdated).format('MMMM Do YYYY, h:mm a')}
      </p>
      <ShareDocumentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} documentId={id}/>
    </div>
  )
}
