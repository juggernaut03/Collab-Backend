import express from 'express';
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
    shareDocument,
} from '../controllers/documentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').post(protect, createDocument).get(protect, getDocuments);
router
    .route('/:id')
    .get(protect, getDocumentById)
    .put(protect, updateDocument)
    .delete(protect, deleteDocument);

router.route('/:id/share').post(protect, shareDocument);

export default router;
