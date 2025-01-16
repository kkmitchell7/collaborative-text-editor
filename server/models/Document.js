const {Schema, model, mongoose} = require('mongoose')

/**
 * Document Schema
 * 
 * @typedef {Object} Document
 * @property {string} title - The title of the document. Defaults to 'Untitled' if not provided.
 * @property {Object} data - The actual content of the document, stored as an object. 
 * @property {Date} createdAt - The timestamp when the document was created. Defaults to the current date and time.
 * @property {mongoose.Schema.Types.ObjectId} owner - The ID of the user who owns the document. References the 'User' model.
 * @property {mongoose.Schema.Types.ObjectId[]} usersWithAccess - An array of user IDs who have access to the document, including the owner. References the 'User' model.
 */
const Document = new Schema({
    title:{type: String, default: 'Untitled', maxlength: [20, 'Title must be less than 21 characters']},
    data: Object,
    createdAt: {
        type: Date,
        default: Date.now // Default timestamp for when the document is created
    },
    lastUpdatedAt: {
        type:Date,
        default:Date.now
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usersWithAccess: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] //Includes owner
})

module.exports = model("Document",Document);