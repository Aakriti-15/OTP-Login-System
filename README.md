# Node.js + MySQL User Authentication App 🔐

A full-stack web application built with **Node.js**, **Express**, **MySQL**, and **Handlebars** that enables users to register, log in using email-based OTP (One-Time Password), and manage authentication with JWT.

---

## 🚀 Features

- ✅ User Registration with hashed passwords  
- ✅ Login via Email and OTP (One-Time Password)  
- ✅ Secure sessions using **JWT**  
- ✅ Email verification with **Nodemailer**  
- ✅ Password hashing with **bcryptjs**  
- ✅ MySQL database integration  
- ✅ Google reCAPTCHA v2 integration for spam protection  
- ✅ Custom alerts and redirection for invalid or duplicate users  
- ✅ Clean and modern UI using **Bootstrap 5**  
- ✅ Environment variable support for sensitive config  

---

## 🖥️ Technologies Used

- [Node.js](w)  
- [Express.js](w)  
- [MySQL](w)  
- [Handlebars (hbs)](w)  
- [Nodemailer](w)  
- [bcryptjs](w)  
- [jsonwebtoken (JWT)](w)  
- [Bootstrap 5](w)  
- [Google reCAPTCHA](w)  
- [dotenv](w)  
- [axios](w)  

---

## 📁 Project Structure

project/
│
├── controllers/ # Auth logic
│ └── auth.js
│
├── public/ # Static assets (CSS, images)
│ └── style.css
│
├── views/ # Handlebars templates
│ ├── login.hbs
│ ├── register.hbs
│ └── dashboard.hbs
│
├── routes/
│ └── auth.js
│
├── .env # Environment variables (not pushed to GitHub)
├── app.js # Main Express app
├── package.json
└── README.md

---

## ⚙️ Setup Instructions

### 1. Clone the Repository


git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
2. Install Dependencies

npm install

3. Set Up your .env File

DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE=yourdbname
DATABASE_PORT=port
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourapppassword
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
COOKIE_EXPIRES=1
RECAPTCHA_SECRET_KEY=your_google_recaptcha_secret_key

4. Start the server
npm start


6. Testing
Try registering with an existing email to see validation.

Try logging in without registering to be redirected.

OTP is sent via email — test with a real or test Gmail account.

reCAPTCHA is required on login to avoid spam login attempts.

 ### Credits
Created by AAKRITI AGGARWAL
Inspired by real-world user authentication needs.









