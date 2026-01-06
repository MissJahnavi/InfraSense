import { db } from '../config/firebase.js';

// Get all issues for admin dashboard
export const getAllIssuesForAdmin = async (req, res) => {
    try {
        const { status, severity, category, sortBy = 'createdAt', order = 'desc' } = req.query;

        if (!db) {
            return res.json([]);
        }

        let query = db.collection('issues');

        // Apply filters
        if (status) {
            query = query.where('status', '==', status);
        }
        if (severity) {
            query = query.where('severity', '==', severity);
        }
        if (category) {
            query = query.where('category', '==', category);
        }

        // Apply sorting
        query = query.orderBy(sortBy, order);

        const snapshot = await query.get();
        const issues = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));

        res.json(issues);
    } catch (error) {
        console.error('Error fetching admin issues:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get admin statistics
export const getAdminStats = async (req, res) => {
    try {
        if (!db) {
            return res.json({ 
                total: 0, 
                pending: 0, 
                inProgress: 0, 
                resolved: 0,
                bySeverity: { low: 0, medium: 0, high: 0 }
            });
        }

        const snapshot = await db.collection('issues').get();
        const issues = snapshot.docs.map(doc => doc.data());

        const stats = {
            total: issues.length,
            pending: issues.filter(i => i.status === 'open').length,
            inProgress: issues.filter(i => i.status === 'in-progress').length,
            resolved: issues.filter(i => i.status === 'resolved').length,
            bySeverity: {
                low: issues.filter(i => i.severity === 'low').length,
                medium: issues.filter(i => i.severity === 'medium').length,
                high: issues.filter(i => i.severity === 'high').length
            }
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update issue status (admin)
export const updateIssueStatusAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['open', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        if (!db) {
            return res.json({ id, status, message: 'Status updated (Mock)' });
        }

        await db.collection('issues').doc(id).update({ 
            status, 
            updatedAt: new Date().toISOString(),
            updatedBy: req.auth.userId // Track who updated
        });

        res.json({ id, status, message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating issue status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};