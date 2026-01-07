import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import issuesRouter from './routes/issuesRoutes.js';
import adminRouter from './routes/adminRoutes.js'; // NEW

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    // Allow all origins dynamically
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('images'));

// Routes
app.use('/api/issues', issuesRouter);
app.use('/api/admin', adminRouter); // NEW

// Health Check
app.get('/', (req, res) => {
    res.send('InfraSense Backend is running');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is working' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

export default app;