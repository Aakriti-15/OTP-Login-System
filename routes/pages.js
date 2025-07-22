const express = require('express');
const router = express.Router();
const upload = require('../upload');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('../db');

// Home & static pages
router.get('/', (req, res) => res.render('index'));
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => {
  const message = req.query.message;
  let displayMessage = null;

  if (message === 'login_required') {
    displayMessage = "Please log in to continue.";
  } else if (message === 'registered') {
    displayMessage = "Registration successful. Please log in.";
  } else if (message === 'not_found') {
    displayMessage = "User not found. Please register.";
  }

  res.render('login', { message: displayMessage });
});

router.get('/verify-otp', (req, res) => res.render('verify-otp'));
router.get('/more', (req, res) => res.render('more'));

// Auth check before tracker
router.get('/tracker', (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect('/login?message=login_required');
  }
  res.render('tracker');
});

// Dashboard
router.get('/dashboard', (req, res) => {
  const userEmail = req.session.userEmail;
  if (!userEmail) return res.redirect('/login?message=login_required');

  // ADMIN view
  if (userEmail === process.env.AUTH_GMAIL) {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    db.query('SELECT * FROM loginuser LIMIT ? OFFSET ?', [limit, offset], (err, users) => {
      if (err) return res.render('dashboard', { error: 'DB error', success: null });

      db.query('SELECT COUNT(*) AS total FROM loginuser', (countErr, countResult) => {
        const totalPages = Math.ceil(countResult[0].total / limit);
        res.render('dashboard', {
          admin: true,
          users,
          page,
          totalPages,
          email: userEmail
        });
      });
    });

  } else {
    // NORMAL user view
    db.query('SELECT original_name, upload_time FROM uploaded_files WHERE email = ?', [userEmail], (err, results) => {
      res.render('dashboard', {
        admin: false,
        email: userEmail,
        success: null,
        error: null,
        files: results || []
      });
    });
  }
});

// Upload Excel or PDF/Image
router.post('/upload-file', upload.single('file'), (req, res) => {
  const userEmail = req.session.userEmail;
  if (!userEmail) return res.redirect('/login?message=login_required');

  if (!req.file) {
    return res.render('dashboard', {
      admin: false,
      email: userEmail,
      error: 'No file uploaded',
      success: null,
      files: []
    });
  }

  const { originalname, path: filePath } = req.file;
  const ext = path.extname(originalname).toLowerCase();

  // If Excel, parse and insert data
  if (ext === '.xlsx' || ext === '.xls') {
    try {
      const wb = xlsx.readFile(filePath);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
      if (!data.length) {
        return res.render('dashboard', {
          admin: false,
          email: userEmail,
          error: 'Excel is empty',
          success: null,
          files: []
        });
      }

      data.forEach(row => {
        const { name, email, password } = row;
        if (name && email && password) {
          const hashed = bcrypt.hashSync(password, 10);
          db.query('INSERT INTO loginuser (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
        }
      });

    } catch (err) {
      console.error('Excel parse error', err);
      return res.render('dashboard', {
        admin: false,
        email: userEmail,
        error: 'Failed to process Excel',
        success: null,
        files: []
      });
    }
  }

  // Save file metadata
  db.query('INSERT INTO uploaded_files (email, original_name, file_path) VALUES (?, ?, ?)',
    [userEmail, originalname, filePath], (err) => {
      if (err) console.error('Logging error:', err);
    });

  // Show updated dashboard
  db.query('SELECT original_name, upload_time FROM uploaded_files WHERE email = ?', [userEmail], (err, results) => {
    res.render('dashboard', {
      admin: false,
      email: userEmail,
      success: 'File uploaded successfully',
      error: null,
      files: results || []
    });
  });
});

module.exports = router;
