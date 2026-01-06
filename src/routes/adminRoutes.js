import express from 'express';
import { requireAuth, requireGovRole } from '../middlewares/auth.js';
import { 
    getAllIssuesForAdmin, 
    updateIssueStatusAdmin,
    getAdminStats 
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require government role
router.use(requireAuth, requireGovRole);

// Get all issues (admin view)
router.get('/issues', getAllIssuesForAdmin);

// Get admin statistics
router.get('/stats', getAdminStats);

// Update issue status
router.patch('/issues/:id/status', updateIssueStatusAdmin);

export default router;