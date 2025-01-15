import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import './styles.css'

export default function DocumentIcon({title, id }) {
    const navigate = useNavigate();
  return (
    <div className="document-icon-container">
      <button
        className="document-icon-button"
        onClick={() => navigate(`/documents/${id}`)}
      >
        <div className="document-icon">
          {/* Icon content, you can add an image here if needed */}
        </div>
        <div className="document-title">{title}</div>
      </button>
    </div>
  )
}
