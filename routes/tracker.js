const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/tracker');
const requireLogin = require('../middleware/authMiddleware');

router.get('/tracker', requireLogin, trackerController.showTracker);
router.post('/tracker', requireLogin, trackerController.saveLog);

module.exports = router;
