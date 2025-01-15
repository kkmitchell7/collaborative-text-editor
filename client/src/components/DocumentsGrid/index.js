import React from 'react';
import DocumentIcon from '../DocumentIcon';

export default function DocumentsGrid  ({ documents, navigate }) {
  return (
    <div className="document-icons-grid">
      {documents.map((doc) => (
        <DocumentIcon
          key={doc._id}
          id={doc._id}
          title={doc.title}
          navigate={navigate}
        />
      ))}
    </div>
  );
};

