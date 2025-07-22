const express = require('express')
const router = express.Router();
const authController= require('../controllers/auth');
const nodemailer= require("nodemailer");
router.get('/register', authController.register)
router.post('/register', authController.register);

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);



router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.redirect('/dashboard'); // fallback
    }
    res.clearCookie('connect.sid'); // remove session cookie
    res.render('logout'); // render logout.hbs
  });
});


module.exports= router; 



// this page is only dealing with the authorization part like register, verufy-otp , send-otp etc