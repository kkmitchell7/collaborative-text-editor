
const io = require('socket.io')(3001, {
    cors: { //cors allows support for client & server to have diff urls
        origin: 'http://localhost:3000',
        methods: ['GET','POST'],
    },
})



/**
 * Establishes real time two way communication, persistent connection via the socket
 * Listens for text changes being sent, and broadcasts these changes to all clients
 */
io.on("connection", socket =>{
    //Listen for get document request
    socket.on('get-document', documentId =>{
        const data = ""
        socket.join(documentId) //put this connection into the room labeled by documentId

        socket.emit('load-document',data)

        //Listen for text changes
        socket.on('send-changes', delta =>{
        socket.broadcast.to(documentId).emit("recieve-changes",delta) //Broadcast to all connections in the same room these changes, except the one that emmited the event
        }) 
    })

    
    console.log('connected');
})