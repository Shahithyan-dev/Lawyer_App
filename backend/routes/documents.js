const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get all documents
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find()
      .populate('caseReference', 'title caseId')
      .populate('clientReference', 'name clientId')
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload a new document
router.post('/', upload.single('documentFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const newDoc = new Document({
    title: req.body.title,
    fileUrl: `/uploads/${req.file.filename}`,
    caseReference: req.body.caseReference || null,
    clientReference: req.body.clientReference || null,
    uploadedBy: req.body.uploadedBy
  });

  try {
    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
