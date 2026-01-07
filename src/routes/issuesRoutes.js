import express from 'express';
import { createIssue, getIssues, updateIssueStatus, getIssueById } from '../controllers/issuesController.js';
import { requireAuth, requireGovRole } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Public routes (or basic auth)
router.get('/', getIssues);
router.get('/:id', getIssueById); // New route for single issue

// Protected routes - Users
router.post('/', requireAuth, upload.single('image'), createIssue);

// Protected routes - Government/Admin only
router.patch('/:id/status', requireAuth, requireGovRole, updateIssueStatus);

export default router;