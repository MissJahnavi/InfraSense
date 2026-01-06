// import { db } from '../config/firebase.js';
// import { predictSeverity } from '../services/mlService.js';

// export const createIssue = async (req, res) => {
//     try {
//         const { title, description, latitude, longitude, address } = req.body;
//         const { userId } = req.auth; // From Clerk middleware

//         if (!title || !description || !latitude || !longitude) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Handle Image
//         let imageUrl = null;
//         if (req.file) {
//             // Store the path relative to the project root
//             // We'll replace backslashes with forward slashes for URL consistency
//             imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
//         }

//         // Call ML Service
//         const aiAnalysis = await predictSeverity(req.file ? req.file.path : null, description);

//         const newIssue = {
//             userId,
//             title,
//             description,
//             address,
//             location: {
//                 lat: parseFloat(latitude),
//                 lng: parseFloat(longitude)
//             },
//             imageUrl,
//             status: 'open',
//             severity: aiAnalysis.severity,
//             aiConfidence: aiAnalysis.confidence,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         };

//         if (db) {
//             const docRef = await db.collection('issues').add(newIssue);
//             res.status(201).json({ id: docRef.id, ...newIssue });
//         } else {
//             // Fallback if DB not connected (e.g. no env vars)
//             res.status(201).json({ id: 'mock-id', ...newIssue, note: 'DB not connected' });
//         }

//     } catch (error) {
//         console.error('Error creating issue:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const updateIssueStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         if (!['open', 'in-progress', 'resolved'].includes(status)) {
//             return res.status(400).json({ error: 'Invalid status' });
//         }

//         // Ideally check if req.auth.userId is an admin here

//         if (db) {
//             await db.collection('issues').doc(id).update({ status, updatedAt: new Date().toISOString() });
//             res.json({ id, status, message: 'Status updated' });
//         } else {
//             res.json({ id, status, message: 'Status updated (Mock)' });
//         }
//     } catch (error) {
//         console.error('Error updating issue:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// export const getIssues = async (req, res) => {
//     try {
//         if (!db) {
//             return res.json([]);
//         }
//         const snapshot = await db.collection('issues').orderBy('createdAt', 'desc').get();
//         const issues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         res.json(issues);
//     } catch (error) {
//         console.error('Error fetching issues:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };










import { db } from '../config/firebase.js';
import { predictSeverity } from '../services/mlService.js';

export const createIssue = async (req, res) => {
    try {
        const { title, description, latitude, longitude, address } = req.body;
        const { userId } = req.auth;

        if (!title || !description || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
        }

        const aiAnalysis = await predictSeverity(req.file ? req.file.path : null, description);

        const newIssue = {
            userId,
            title,
            description,
            address,
            location: {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
            },
            imageUrl,
            status: 'open',
            severity: aiAnalysis.severity,
            aiConfidence: aiAnalysis.confidence,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (db) {
            const docRef = await db.collection('issues').add(newIssue);
            res.status(201).json({ id: docRef.id, ...newIssue });
        } else {
            res.status(201).json({ id: 'mock-id', ...newIssue, note: 'DB not connected' });
        }

    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateIssueStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['open', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        if (db) {
            await db.collection('issues').doc(id).update({ 
                status, 
                updatedAt: new Date().toISOString() 
            });
            res.json({ id, status, message: 'Status updated' });
        } else {
            res.json({ id, status, message: 'Status updated (Mock)' });
        }
    } catch (error) {
        console.error('Error updating issue:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getIssues = async (req, res) => {
    try {
        if (!db) {
            return res.json([]);
        }
        const snapshot = await db.collection('issues').orderBy('createdAt', 'desc').get();
        const issues = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(issues);
    } catch (error) {
        console.error('Error fetching issues:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// NEW: Get single issue by ID
export const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!db) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        const doc = await db.collection('issues').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error fetching issue:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};