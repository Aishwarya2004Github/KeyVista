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
import fs from 'fs';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config(); 
const PORT = process.env.PORT || 5000;

const app = express();

// Ensure the uploads folder exists
const __dirname = path.resolve(); // Get the current directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Middlewares
app.use(cors({
  origin: 'https://keyvista.onrender.com', // Adjust according to your frontend URL
}));
app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For parsing cookies

// MongoDB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// User avatar upload endpoint
app.post('/api/user/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const filePath = `https://keyvista.onrender.com/uploads/${req.file.filename}`; // Adjust URL if needed
  res.json({ success: true, filePath });
});

// File upload endpoint for listing images
app.post('/api/uploads', upload.array('images', 6), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const imageUrls = req.files.map(file => `https://keyvista.onrender.com/uploads/${file.filename}`);
  res.json({ success: true, imageUrls });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files for the client
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-all route for SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handler middleware (should be placed after all routes)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
