const express = require('express')
const router = express.Router();
const authController= require('../controllers/auth');
const nodemailer= require("nodemailer");
router.get('/register', authController.register)
router.post('/register', authController.register);

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
module.exports= router; 

// this page is only dealing with the authorization part like register, verufy-otp , send-otp etc