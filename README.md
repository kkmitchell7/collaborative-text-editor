# collaborative-text-editor
Real Time Collaborative Text Editor made with React, Socket.io, and MongoDB

This is a real-time collaborative text editor built with **React**, **Socket.IO**, and **MongoDB**, mimicking the core functionality of Google Docs. Users can sign up, log in, create documents, share them with others, and collaborate on them in real-time, similar to Google Docs. Changes are synchronized in real-time across all connected clients, and document access permissions are fully manageable. OpenAI's Chat GPT is integrated into the project in two areas: for creative writing prompt generation and through a chat bot named Inspira. Inspira has access to user's documents to give specialized feedback as well as support writers in brainstorming, especially when faced with writers block.

## Features
- **User Authentication**: Users can sign up and log in to securely access and manage documents.
- **Real-Time Collaboration**: Collaborate on documents with other users in real-time. Changes made by one user are instantly reflected for all others.
- **Rich Text Editing**: Built with the Quill.js rich text editor.
- **Persistent Data**: Documents are stored and retrieved from a MongoDB database.
- **Room-Based Collaboration**: Each document has a unique ID, allowing users to collaborate in separate rooms.
- **Document Management**: 
  - **Create Documents**: Users can create new documents.
  - **Share Documents**: Share documents with other users and assign access permissions.
  - **Revoke Access**: Remove a user's access to a document.
  - **Delete Documents**: Delete documents from the system.
  - **View Shared Documents**: View documents that have been shared with the user.
- **Generate Custom Writing Prompts**: Use keywords to generate custom creative writing prompts
- **Inspira Chat Bot**: AI chat bot which analyzes your document and can provide contextual feedback and brainstorming support on your project. 


## Tech Stack
- **Frontend**: React, Quill.js
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB with Mongoose

## Installation and Setup

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running locally

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kkmitchell7/collaborative-text-editor.git

2. **Install Dependencies**:
    ```bash
    cd client
    npm install
    cd ../server
    npm install

3. **Start MongoDB**:
    By default, the server will attempt to connect to a MongoDB instance at mongodb://localhost/document_data

4. **Start the client and server**:
    ```bash
    cd server
    npm devStart
    cd ../client
    npm start

5. **Access the App**:
    Open your browser and go to http://localhost:3000
    You can then create an account, login, and manage your documents as well as sharing permissions for each document


