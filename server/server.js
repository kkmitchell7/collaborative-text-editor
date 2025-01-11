
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
    socket.on('send-changes', delta =>{ //Listen for text changes
        socket.broadcast.emit("recieve-changes",delta) //Broadcast to all connections these changes, except the one that emmited the event
    }) 
    console.log('connected');
})