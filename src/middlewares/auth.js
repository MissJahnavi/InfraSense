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


export const requireGovRole = async (req, res, next) => {

  const publicMetadata = req.auth.sessionClaims?.publicMetadata || {};
  const userRole = publicMetadata.role || 'citizen';



  if (userRole !== 'government') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};


// Middleware to sync user (placeholder for future use)
export const syncUser = async (req, res, next) => {
    next();
};