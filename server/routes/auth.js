const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /api/auth/register
 * Register a new user
 * 
 * @body {string} username - The username of the user to be created
 * @body {string} password - The password of the user to be created
 * 
 * @returns {Object} 400 - Error message if the username or password have not been required in the request body
 * @returns {Object} 400 - Error message if the username is already taken
 * @returns {Object} 200 - A success message that the user has been created
 * @returns {Object} 500 - Error message if an internal server error has occured, like if the username is taken
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
        return res.status(400).json({error: 'Username and password are required in the request body to create a user'})
    }

    try {
        //Ensure no duplicate usernames
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

/**
 * POST /api/auth/login
 * Authenticate a user and issue a token
 * 
 * @body {string} username - The username of the user to be logged in
 * @body {string} password - The password of the user to be logged in
 * 
 * @returns {Object} 400 - Error message if the username or password have not been required in the request body
 * @returns {Object} 401 - Error message if invalid credentials have been provided
 * @returns {Object} 200 - The userId of the user logged in and token generated
 * @returns {Object} 500 - Error message if an internal server error has occured
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password){
        return res.status(400).json({error: 'Username and password are required in the request body to log in a user'})
    }
    if (username.length >15){
        return res.status(400).json({error: 'Username must be 15 characters or less'})
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'Invalid username or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '100h' }); //add security here after development
        res.json({ userId: user._id,token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /api/auth/verify
 * Verify a user's token
 * 
 * @header {string} token - The token to be validated
 * 
 * @returns {Object} 401 - Error message if no token is in the request header
 * @returns {Object} 200 - Valid varible set to true and the userId
 * @returns {Object} 401 - Valid varible set to false and invalid token message
 */
router.get('/verify', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ valid: true, userId: decoded.id });
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
});



module.exports = router;