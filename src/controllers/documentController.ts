import { Request, Response } from 'express';
import Doc from '../models/Document';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Create a new document
// @route   POST /api/documents
// @access  Private
export const createDocument = async (req: AuthRequest, res: Response) => {
    try {
        const document = await Doc.create({
            owner: req.user?._id,
            collaborators: [],
            content: {}, // Initial empty content
        });

        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get all documents for user (owned + shared)
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req: AuthRequest, res: Response) => {
    try {
        const documents = await Doc.find({
            $or: [{ owner: req.user?._id }, { collaborators: req.user?._id }],
        }).sort({ updatedAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Private
export const getDocumentById = async (req: AuthRequest, res: Response) => {
    try {
        const document = await Doc.findById(req.params.id);

        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        // Check if user has access
        if (
            document.owner.toString() !== req.user?._id.toString() &&
            !document.collaborators.some((collab) => collab.toString() === req.user?._id.toString())
        ) {
            res.status(403).json({ message: 'Not authorized to view this document' });
            return;
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Update document content (usually handled via Socket, but good for meta updates)
// @route   PUT /api/documents/:id
// @access  Private
export const updateDocument = async (req: AuthRequest, res: Response) => {
    try {
        const { title } = req.body;
        const document = await Doc.findById(req.params.id);

        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        if (document.owner.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to update this document' });
            return;
        }

        document.title = title || document.title;
        const updatedDocument = await document.save();

        res.json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req: AuthRequest, res: Response) => {
    try {
        const document = await Doc.findById(req.params.id);

        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        if (document.owner.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Not authorized to delete this document' });
            return;
        }

        await document.deleteOne();
        res.json({ message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Share document with another user
// @route   POST /api/documents/:id/share
// @access  Private
export const shareDocument = async (req: AuthRequest, res: Response) => {
    try {
        const { email } = req.body;
        const document = await Doc.findById(req.params.id);

        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        if (document.owner.toString() !== req.user?._id.toString()) {
            res.status(403).json({ message: 'Only the owner can share this document' });
            return;
        }

        const userToShare = await User.findOne({ email });

        if (!userToShare) {
            res.status(404).json({ message: 'User with this email not found' });
            return;
        }

        if (document.collaborators.includes(userToShare._id)) {
            res.status(400).json({ message: 'User is already a collaborator' });
            return;
        }

        if (document.owner.toString() === userToShare._id.toString()) {
            res.status(400).json({ message: 'You are already the owner' });
            return;
        }

        document.collaborators.push(userToShare._id);
        await document.save();

        res.json({ message: 'Document shared successfully', user: { username: userToShare.username, email: userToShare.email } });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
