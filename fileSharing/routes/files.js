const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const auth = require('../middleware/auth');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload file
router.post('/upload', [auth, upload.single('file')], async (req, res) => {
  try {
    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id
    });

    await newFile.save();
    res.json(newFile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all files for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user.id });
    res.json(files);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Share file with another user
router.post('/share/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });

    if (file.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const { userId } = req.body;
    if (file.sharedWith.includes(userId)) {
      return res.status(400).json({ msg: 'File already shared with this user' });
    }

    file.sharedWith.push(userId);
    await file.save();

    res.json(file);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;