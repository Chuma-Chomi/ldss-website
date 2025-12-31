import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import staffRoutes from './routes/staff';
import seedRoutes from './routes/seed';
import { errorHandler } from './utils/errors';

dotenv.config();

const app = express();
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow all origins in development
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(cookieParser());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'LDSS API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/seed', seedRoutes);
// Add other routes if needed
// app.use('/api/students', studentRoutes);
// app.use('/api/classes', classRoutes);
// app.use('/api/announcements', announcementRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/grades', gradeRoutes);
// app.use('/api/timetable', timetableRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`LDSS API listening on port ${port}`);
});
