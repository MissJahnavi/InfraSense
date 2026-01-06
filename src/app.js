import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import issuesRouter from './routes/issuesRoutes.js';
import adminRouter from './routes/adminRoutes.js'; // NEW

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
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
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`✅ API available at http://localhost:${PORT}/api`);
    console.log(`✅ Admin API at http://localhost:${PORT}/api/admin`);
});

export default app;