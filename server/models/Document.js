const {Schema, model} = require('mongoose')

const Document = new Schema({
    title:{type: String, default: 'Untitled'},
    data: Object,
    createdAt: {
        type: Date,
        default: Date.now // Default timestamp for when the document is created
    }
})

module.exports = model("Document",Document);