const express = require('express');
const Document = require('../models/Document');
const User = require('../models/User');
const router = express.Router();

/**
 * POST /api/documents/
 * Create a new document and attach it to a specific user
 * 
 * @body {string} userId - userId of the user creating the document which is the owner of the document
 * @body {string} title -  Title of the document to be created
 * 
 * @returns {Object} 201 - An object contianing a new document ID which has been successfully created
 * @returns {Object} 400 - Error message if a userId or title is not provided in the request body
 * @returns {Object} 400 - Error message if the title is greater than 20 characters
 * @returns {Object} 404 - Error message if a user cannot be found with that id
 * @returns {Object} 500 - Error message if a server error occurs
 * 
 */
router.post('/', async (req, res) => {
    try {
        const { userId, title } = req.body;

        if (!userId || !title) {
            return res.status(400).json({ error: 'userId and title are required in the request body' });
        }

        if (title.length > 20){
            return res.status(400).json({ error: 'Title must be less than 20 characters.' });
        }

        // Find the user and associate the document with them and add the user to the document's access users
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: `User not found with ID: ${userId}` });
        }

        // Create the new document
        const newDocument = new Document({
            title:title, data: '', owner:user._id // Default content is an empty string
        });

        newDocument.usersWithAccess.push(user._id); //Include the owner as a user with access
        await newDocument.save();

        
        res.status(201).json({newDocumentId:newDocument._id});
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
});

/**
 * DELETE /api/documents/:documentId
 * Delete a specific document by ID
 * 
 * @param {string} documentId - The document which we're finding and deleting
 * 
 * @returns {Object} 200 - A successful message with the deletedDocument
 * @returns {Object} 400 - An error message if no documentId was provided in the request parameters
 * @returns {Object} 404 - Error message if a document cannot be found with that id
 * @returns {Object} 500 - Error message if a server error occurs
 * 
 */
router.delete('/:documentId', async (req, res) => {
    try {
        const documentId = req.params.documentId;

        if (!documentId) {
            return res.status(400).json({ error: 'documentId is a required parameter' });
        }

        const deletedDocument = await Document.findByIdAndDelete(documentId);

        if (deletedDocument) {
            return res.status(200).json({message:`Document deleted successfully:'${deletedDocument}` })
        } else {
            return res.status(404).json({ error: `Document not found with ID:'${documentId}` });
        }


    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});


/**
 * GET /api/documents/:documentId
 * Find a specific document by ID
 * 
 * @param {string} documentId - The document which we're finding and returing
 * 
 * @returns {Object} 200 - An object containing a document object 
 * @returns {Object} 400 - An error message if no documentId was provided in the request parameters
 * @returns {Object} 404 - Error message if a document cannot be found with that id
 * @returns {Object} 500 - Error message if a server error occurs
 * 
 */
router.get('/:documentId', async (req, res) => {
    try {
        const documentId = req.params.documentId;

        if (!documentId) {
            return res.status(400).json({ error: 'documentId is a required parameter' });
        }
        
        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({ error: `Document not found with ID:'${documentId}` });
        }

        res.status(200).json({document:document});
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
});


/**
 * PUT /api/documents/:documentId/access
 * Grant access for a specific document to a user 
 * 
 * @param {string} documentId - The document which we're giving the user access to
 * @body {string} userId - The ID of the user to give access to the document
 *  
 * @returns {Object} 200 - A successful response message that the user has been added to the document's access permissions
 * @returns {Object} 400 - An error message if no documentId was provided in the request parameters or no userId was provided in the request body
 * @returns {Object} 404 - An error message if the document with the given ID cannot be found
 * @returns {Object} 404 - An error message if the user with the given ID cannot be found
 * @returns {Object} 400 - An error message if the user already has access to the document
 * @returns {Object} 500 - Error message if a server error occurs
 */
router.put('/:documentId/access', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const { userId } = req.body;

        if (!documentId || !userId) {
            return res.status(400).json({ error: 'documentId is a required parameter and userId is required in the request body' });
        }

        const document = await Document.findById(documentId);
        if (!document){
            return res.status(404).json({error:`A document cannot be found with the ID: ${documentId}`})
        }

        const user = await User.findById(userId);
        if (!user){
            return res.status(404).json({error:`A user cannot be found with the ID: ${userId}`})
        }

        if (document.usersWithAccess.includes(userId)) {
            return res.status(400).json({ error: `User with ID: ${userId} already has access to the document` });
        }

        document.usersWithAccess.push(user._id);
        await document.save()

        return res.status(200).json({message:`Successfully granted user ${userId} access to the document ${documentId}`})
        
    } catch (error) {
        console.error('Error granting access to user:', error);
        res.status(500).json({ error: 'Failed to grant access to user' });
    }
});

/**
 * DELETE /api/documents/:documentId/access
 * Revoke access to a document from a specific user
 * 
 * @param {string} documentId - The document which we're revoking access from
 * @body {string} userId - The ID of the user to revoke access from the document
 *  
 * @returns {Object} 200 - A successful response message that the document has been removed and saved
 * @returns {Object} 400 - An error message if no documentId was provided in the request parameters or no userId was provided in the request body
 * @returns {Object} 404 - An error message if the document with the given ID cannot be found
 * @returns {Object} 404 - An error message if the user with the given ID cannot be found
 * @returns {Object} 400 - An error message if the request is attempting to remove the owner from the document's permissions
 * @returns {Object} 500 - Error message if a server error occurs
 */
router.delete('/:documentId/access', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        const {userId} = req.body;

        if (!documentId || !userId) {
            return res.status(400).json({ error: 'documentId is a required parameter and userId is required in the request body' });
        }

        const document = await Document.findById(documentId);
        if (!document){
            return res.status(404).json({error:`Document could not be found with ID: ${documentId}`})
        }

        const user = await User.findById(userId);
        if (!user){
            return res.status(404).json({error:`User could not be found with ID: ${userId}`})
        }
        if (user._id.toString() != document.owner._id.toString()){
            await document.usersWithAccess.remove(user._id);
            await document.save();
            return res.status(200).json({message:`User successfully removed from document. User ID: ${userId} Document ID: ${documentId}`})
        } else{
            return res.status(400).json({error:`Cannot revoke owner's access to document.`})
        }
        
    } catch (error) {
        console.error('Error revoking access from user:', error);
        res.status(500).json({ error: 'Failed to revoke access from user' });
    }
});

/**
 * GET /api/documents/:documentId/access
 * Get all users which have access for a specific document
 * 
 * @param {string} documentId - The document which we're getting all users that have access to it
 * 
 * @returns {Object} 200 - An object containing an array of user objects which have access to the document
 * @returns {Object} 400 - An error message if no documentId was provided in the request parameters
 * @returns {Object} 400 - Error message if no users have access to the document
 * @returns {Object} 404 - Error message if the document could not be found with the given documentId
 * @returns {Object} 500 - Error message if a server error occurs
 * 
 * 
 */
router.get('/:documentId/access', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        if (!documentId ) {
            return res.status(400).json({ error: 'documentId is a required parameter' });
        }

        const document = await Document.findById(documentId).populate('usersWithAccess');

        if (!document){
            res.status(404).json({error:`Document not found with id: ${documentId}`})
        }
        if (!document.usersWithAccess){
            res.status(400).json({error:`No users have access to the document with id: ${documentId}`})
        }

        res.status(200).json({users: document.usersWithAccess});
        
    } catch (error) {
        console.error('Error getting users which have access:', error);
        res.status(500).json({ error: 'Failed to get users which have access' });
    }
});

module.exports = router;