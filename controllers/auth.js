const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const axios = require("axios");

// DB connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});

// REGISTER USER
exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM loginUser WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error(error);
            return res.send("Database error");
        }

        if (results.length > 0) {
            return res.render('login', {
                message: 'This email is already in use.<br> Please log in below.'
            });
        }

        if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO loginUser SET ?', {
            name: name,
            email: email,
            password: hashedPassword
        }, (err, result) => {
            if (err) {
                console.error(err);
                return res.send("Error during registration");
            }

            return res.redirect('/login?message=registered');
        });
    });
};

// SEND OTP WITH reCAPTCHA
exports.sendOtp = async (req, res) => {
    const { email, "g-recaptcha-response": token } = req.body;

    if (!token) {
        return res.status(400).send("reCAPTCHA token missing");
    }

    try {
        const captchaRes = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: token
            }
        });

        if (!captchaRes.data.success) {
            return res.status(403).send("Failed reCAPTCHA verification");
        }

        db.query("SELECT * FROM loginUser WHERE email = ?", [email], (err, results) => {
            if (err || results.length === 0) {
                return res.redirect("/register?message=not_found");
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            req.session.otp = otp;
            req.session.email = email;

            const transporter = nodemailer.createTransport({
  host: "74.125.130.109", // IP address of smtp.gmail.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    servername: "smtp.gmail.com", // still needed for TLS handshake
    rejectUnauthorized: false
  }
});

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP for login is: ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.send("Error sending OTP");
                }
                res.render("verify-otp", { email });
            });
        });
    } catch (err) {
        console.error("reCAPTCHA verification failed:", err);
        res.status(500).send("Internal Server Error");
    }
};

// VERIFY OTP
exports.verifyOtp = (req, res) => {
    const { otp } = req.body;
    const email =req.session.email;
   req.session.user ={email:email};
    if (req.session.otp === otp) {
        req.session.userEmail = email;
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        });

        return res.redirect("/dashboard"); // or wherever user should land
    } else {
        return res.render("verify-otp", { message: "Invalid OTP" });
    }
};
