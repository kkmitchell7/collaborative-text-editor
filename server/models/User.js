const mongoose = require('mongoose');


/**
 * User Schema
 * 
 * @typedef {Object} User
 * @property {string} username - The username of the user (unique and required)
 * @property {string} password - The password of the user (required)
 */

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);