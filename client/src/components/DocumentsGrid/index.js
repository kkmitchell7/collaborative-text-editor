import React from 'react';
import DocumentIcon from '../DocumentIcon';

export default function DocumentsGrid  ({ documents, navigate }) {
  const userId = JSON.parse(localStorage.getItem('userId'));
  
  return (
    <div className="document-icons-grid">
      {documents.map((doc) => (
        <DocumentIcon
          key={doc._id}
          id={doc._id}
          title={doc.title}
          navigate={navigate}
          lastUpdated={doc.lastUpdatedAt}
          isOwner = {userId===doc.owner}
        />
      ))}
    </div>
  );
};

