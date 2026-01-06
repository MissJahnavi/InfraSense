// import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
// import dotenv from 'dotenv';

// dotenv.config();

// // Middleware to require authentication
// // This will attach the auth object to req.auth
// export const requireAuth = ClerkExpressRequireAuth({
//     // Optional: Add custom error handling or options here
//     onError: (err, req, res, next) => {
//         console.error('Clerk Auth Error:', err);
//         res.status(401).json({ error: 'Unauthenticated' });
//     }
// });

// // Middleware to create a user in Firestore if they don't exist (Sync)
// // Can be used after requireAuth
// export const syncUser = async (req, res, next) => {
//     // Placeholder for user sync logic if needed
//     // const { userId } = req.auth;
//     next();
// };







import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to require authentication
export const requireAuth = ClerkExpressRequireAuth({
    onError: (err, req, res, next) => {
        console.error('Clerk Auth Error:', err);
        res.status(401).json({ error: 'Unauthenticated' });
    }
});

// Middleware to check if user is government/admin
export const requireGovRole = async (req, res, next) => {
    try {
        const { userId } = req.auth;
        
        if (!userId) {
            return res.status(401).json({ error: 'Unauthenticated' });
        }

        // FIXED: Correct path to Clerk public metadata
        // In Clerk, publicMetadata is at: req.auth.sessionClaims.publicMetadata
        const publicMetadata = req.auth.sessionClaims?.publicMetadata || {};
        const userRole = publicMetadata.role || 'citizen'; // DEFAULT TO CITIZEN, NOT USER
        
        console.log(`🔐 Role Check - User: ${userId}, Role: ${userRole}`); // Debug log
        
        // Check if user has government role
        if (userRole !== 'government' && userRole !== 'admin') {
            console.log(`❌ Access Denied - User ${userId} attempted government action with role: ${userRole}`);
            return res.status(403).json({ 
                error: 'Forbidden: This action requires government authorization',
                userRole: userRole // Send back for debugging
            });
        }

        console.log(`✅ Access Granted - User ${userId} has role: ${userRole}`);
        
        // Attach role to request for downstream use
        req.userRole = userRole;
        next();
    } catch (error) {
        console.error('Role check error:', error);
        res.status(500).json({ error: 'Internal server error during authorization' });
    }
};

// Middleware to sync user (placeholder for future use)
export const syncUser = async (req, res, next) => {
    next();
};