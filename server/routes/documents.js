const express = require('express');
const Document = require('../models/Document');
const User = require('../models/User')
const router = express.Router();

/**
 * GET /api/documents/users/:userId
 * Get all documents attached to a user
 */
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('documents');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.documents);  // Return all documents attached to the user
    } catch (error) {
        console.error('Error fetching user documents:', error);
        res.status(500).json({ error: 'Failed to fetch user documents' });
    }
});

/**
 * POST /api/documents/
 * Create a new document and attach it to a user
 */
router.post('/', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Create the new document
        const newDocument = new Document({
            data: '' // Default content is an empty string
        });

        await newDocument.save();

        // Find the user and associate the document with them
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.documents.push(newDocument); // Attach the document ID to the user's 'documents' array
        await user.save();

        res.status(201).json(newDocument);
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
});

/**
 * GET /api/documents/:doc_id
 * Find a document by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const documentId = req.params.id;
        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
});

module.exports = router;