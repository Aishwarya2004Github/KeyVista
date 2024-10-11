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
import jwt from 'jsonwebtoken';
import { errorHandler } from './middleware/errorHandler.js';
import fs from 'fs'; // Import fs to check for uploads directory

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

app.use(cors({
  origin: 'http://localhost:5000', // Adjust according to your frontend URL
  credentials: true, // Allow credentials like cookies
}));

// Middlewares
app.use(express.json()); // For parsing application/json
app.use(cookieParser()); // For parsing cookies

// JWT Helper for Signing Tokens
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET); // Removed expiresIn
};

// JWT Verification Middleware
const verifyJWT = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user data in req object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.use('/api/user', verifyJWT, userRouter); // Protect user routes with JWT
app.use('/api/auth', authRouter); // Auth routes don't require JWT
app.use('/api/listing', listingRouter); // You can also protect listing routes if needed

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
app.post('/api/user/upload', verifyJWT, upload.single('avatar'), (req, res) => { // Protect this route
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.json({ success: true, filePath });
});

app.post('/api/uploads', verifyJWT, upload.array('images', 6), (req, res) => { // Protect this route
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }

  const imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
  res.json({ success: true, imageUrls });
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, "uploads")));

// Serve static files for the client
app.use(express.static(path.join(__dirname, "client" , "dist")));

// Catch-all route for SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,"uploads","client","dist", "index.html"));
});

// Error handler middleware (should be placed after all routes)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
