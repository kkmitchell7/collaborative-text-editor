const express = require('express');
const Document = require('../models/Document');
const User = require('../models/User');
const router = express.Router();


/**
 * GET /api/users/ID/:username
 * Get the ID assosiated with a username
 * 
 * @param {string} username - the username of the user which we're finding the ID
 * 
 * @returns {Object} 400 - An error message if username is not included in the request parameters
 * @returns {Object} 404 - An error message if the user with the specified username is not found
 * @returns {Object} 200 - The user ID associated with the username
 * @returns {Object} 500 - An error message if an internal server error has occurred
 */
router.get('/ID/:username', async (req, res) => {
    try {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({ error: 'username is a required parameter' });
        }

        const user = await User.findOne({username: username });

        if (!user) {
            return res.status(404).json({ error: `User with username ${username} not found` });
        }


        return res.status(200).json({ userId: user._id }); 
    } catch (error) {
        console.error('Error fetching the users ID:', error);
        return res.status(500).json({ error: 'Failed to fetch the users ID' });
    }
});



/**
 * GET /api/users/:userId/documents/owned
 * Get all documents owned by a specific user
 * 
 * @param {string} userId - The ID of the user which we're getting all their owned documents
 * 
 * @returns {Object} 400 - An error message if userId is not included in the request parameters
 * @returns {Object} 200 - An object containing an array of document objects owned by the user, an empty array if the user owns no documents
 * @returns {Object} 500 - Error message if there was an internal server error
 */
router.get('/:userId/documents/owned', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ error: 'userId is a required parameter' });
        }

        const documents = await Document.find({ owner: userId });

        return res.status(200).json({documents:documents}); 
    } catch (error) {
        console.error('Error fetching users owned documents:', error);
        return res.status(500).json({ error: 'Failed to fetch users owned documents' });
    }
});

/**
 * GET /api/users/:userId/documents/shared
 * Get all documents shared with a specific user (where shared means the user has access but is not the owner)
 * 
 * @param {string} userId - the ID of the user which we're getting all the documents shared with them
 * 
 * @returns {Object} 400 - An error message if userId is not included in the request parameters
 * @returns {Object} 200 - An object containing an array of document objects shared with the user, an empty array if the user has no documents shared with them
 * @returns {Object} 500 - An error message if an internal server error has occured
 */
router.get('/:userId/documents/shared', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'userId is a required parameter' });
        }

        const documents = await Document.find({
            usersWithAccess: userId,            // User is in the usersWithAccess array
            owner: { $ne: userId }              // User is NOT the owner
        });


        return res.status(200).json({documents:documents}); 
    } catch (error) {
        console.error('Error fetching users shared documents:', error);
        return res.status(500).json({ error: 'Failed to fetch users shared documents' });
    }
});


/**
 * GET /api/users/:userId/documents/accessible
 * Get all documents a specific user has access to (owned and shared with documents)
 * 
 * @param {string} userId - the ID of the user which we're getting all the documents they have access to
 * 
 * @returns {Object} 400 - An error message if userId is not included in the request parameters
 * @returns {Object[]} 200 - An object containing an array of document objects the user has access to, an empty array if the user has no documents it has access to
 * @returns {Object} 500 - An error message if an internal server error has occured
 */
router.get('/:userId/documents/accessible', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'userId is a required parameter' });
        }

        const documents = await Document.find({
            usersWithAccess: userId
        });


        return res.status(200).json({documents:documents}); 
    } catch (error) {
        console.error('Error fetching documents user has access to:', error);
        return res.status(500).json({ error: 'Failed to fetch documents user has access to' });
    }
});



module.exports = router;