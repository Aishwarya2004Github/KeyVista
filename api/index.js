import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import multer from 'multer'; 
import cors from 'cors';
import path from 'path';
import { errorHandler } from './middleware/errorHandler.js'; 

dotenv.config(); // Load environment variables
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve(); // Get the current directory
const app = express();

// CORS configuration: use different origins for development and production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'http://localhost:5000' // Adjust for production
    : 'http://localhost:3000' // Adjust for development
}));

// Middlewares
app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For parsing cookies

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// File upload routes
app.post('/api/user/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`; // Adjust if needed
  res.json({ success: true, filePath });
});

app.post('/api/uploads', upload.array('images', 6), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
  res.json({ success: true, imageUrls });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files for the client
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-all route for Single Page Application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads','client', 'dist', 'index.html'));
});

// Error handler middleware (should be placed after all routes)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
