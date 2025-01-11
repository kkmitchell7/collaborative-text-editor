/**
 * Set up database library via mongoose for mongoDB and import Document model
 */
const mongoose = require('mongoose')
const Document = require('./Document')

/**
 * Connect to mongoose
 */
mongoose.connect('mongodb://localhost/document_data',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


/**
 * Set up socket library via socket.io
 */
const io = require('socket.io')(3001, {
    cors: { //cors allows support for client & server to have diff urls
        origin: 'http://localhost:3000',
        methods: ['GET','POST'],
    },
})

const defaultValue = "" //Default document data

/**
 * Establishes real time two way communication, persistent connection via the socket
 * Listens for text changes being sent, and broadcasts these changes to all clients
 */
io.on("connection", socket =>{
    //Listen for get document request
    socket.on('get-document', async documentId =>{
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId) //put this connection into the room labeled by documentId

        socket.emit('load-document',document.data)

        //Listen for text changes
        socket.on('send-changes', delta =>{
        socket.broadcast.to(documentId).emit("recieve-changes",delta) //Broadcast to all connections in the same room, except the one that emmited the event
        }) 

        //Listen for save document emission
        socket.on("save-document", async data =>{
            await Document.findByIdAndUpdate(documentId, {data})
        })
    })

    
    console.log('connected');
})


/**
 * 
 * @param {*} id of document
 * @returns Created document or document found in the database
 */
async function findOrCreateDocument(id){
    if (id == null) return

    const document = await Document.findById(id)
    if (document) return document

    return await Document.create({_id:id, data:defaultValue})
}