# collaborative-text-editor
Real Time Collaborative Text Editor (Google Docs Clone) made with React, Socket.io, and MongoDB

This is a real-time collaborative text editor built with **React**, **Socket.IO**, and **MongoDB**, mimicking the core functionality of Google Docs. Users can edit shared documents simultaneously, and changes are synchronized in real-time across all connected clients.

## Features
- **Real-Time Collaboration**: Changes made by one user are instantly reflected for all others.
- **Rich Text Editing**: Built with the Quill.js rich text editor.
- **Persistent Data**: Documents are stored and retrieved from a MongoDB database.
- **Room-Based Collaboration**: Each document has a unique ID, allowing users to collaborate in separate rooms.

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
    Each document is identified by a unique ID in the URL. For example: http://localhost:3000/documents/id


