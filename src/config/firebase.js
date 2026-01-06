import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Construct service account object from env vars
// Note: Private key usually needs handling of newlines
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined
};

// Initialize only if not already initialized
let db;

try {
    if (serviceAccount.projectId) {
        initializeApp({
            credential: cert(serviceAccount)
        });
        db = getFirestore();
        console.log('Firebase initialized successfully');
    } else {
        console.warn('Firebase credentials not found in environment variables');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
}

export { db };
