const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Document = require('./models/Document')
const User = require('./models/User')
const http = require('http');



/**
 * Express/HTTP server functionality
 */


const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'DELETE','PUT'],
    })
);
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/document_data', {});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);

const server = http.createServer(app);

/**
 * 
 * Socket functionality
 * 
 */

/**
 * Set up socket library via socket.io
 */
    const io = require('socket.io')(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });


/**
 * Establishes real time two way communication, persistent connection via the socket
 * Listens for text changes being sent, and broadcasts these changes to all clients
 */
io.on("connection", socket =>{
    //Listen for get document request
    socket.on('get-document', async ({ documentId, userId }) =>{
        if (!mongoose.isValidObjectId(documentId)) {
            socket.emit('error', { message: 'Not a valid document ID' });
            return; // Exit early to avoid further processing
        }

        try {

        const document = await Document.findById(documentId);
        if (!document) {
            socket.emit('error', { message: 'Document doesnt exist' });
            return; // Exit if no document is found
        }

        // Fetch the user and check if the user has access permissions
        const user = await User.findById(userId);
        if (!user || (!document.usersWithAccess.includes(user._id))) {
            socket.emit('error', { message: 'Access denied.' });
            return; //Exit if user doesn't have access
        }

        //Validation complete, we can continue to real time collaborative editor logic

        socket.join(documentId) //put this connection into the room labeled by documentId

        socket.emit('load-document',document.data)

        //Listen for text changes
        socket.on('send-changes', delta =>{
        socket.broadcast.to(documentId).emit("recieve-changes",delta) //Broadcast to all connections in the same room, except the one that emmited the event
        }) 

        //Listen for save document emission
        socket.on("save-document", async data =>{
            await Document.findByIdAndUpdate(documentId, {data:data,lastUpdatedAt:Date.now()})
        })} catch (error) {
            console.error('Error handling document:', error);
            socket.emit('error', { message: 'An error occurred while processing the document' });
        }
    })

    
    console.log('connected');

    //Need to handle disconnection
})



// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
