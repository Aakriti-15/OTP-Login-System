const express = require('express')
const router = express.Router();
const authController= require('../controllers/auth');
const nodemailer= require("nodemailer");
router.get('/register', authController.register)
router.post('/register', authController.register);

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
module.exports= router; 