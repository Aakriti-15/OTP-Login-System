
const mysql = require ("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require ("bcryptjs");


const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
     port: process.env.DATABASE_PORT
}); 


exports.register = async(req, res)=>{
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;
    
    db.query('SELECT email from loginUser where email= ?', [email], async(error, results)=>{
        if(error){
            console.log(error);
            return res.send("Database error");
        }
        
        if(results.length > 0){
            return res.render('login', {
                message: 'This email is already in use.<br> Please log in below.'
            })
        }else if(password !== passwordConfirm){
                return res.render('register',{
                    message: 'Passwords do not match'
                });
            }
            let hashedPassword = await bcrypt.hash(password , 8)
            console.log(hashedPassword); 

db.query('insert into loginUser set ?',{name: name, email: email, password: hashedPassword }, (error,results)=>{
if(error){
    console.log(error);
}
else{
    console.log(results);
   return res.redirect('/login?message=registered');
}
})


        
    });
        
   
}
const nodemailer = require("nodemailer");


// SEND OTP
exports.sendOtp = (req, res) => {
    const { email } = req.body;

    db.query("SELECT * FROM loginUser WHERE email = ?", [email], (err, results) => {
        if (err || results.length === 0) {
    return res.redirect("/register?message=not_found");
}


        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        req.session.otp = otp;
        req.session.email = email;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        console.log(transporter);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP for login is: ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.send("Error sending OTP");
            }
            res.render("verify-otp", { email });
        });
    });
};

// VERIFY OTP
exports.verifyOtp = (req, res) => {
    const { otp } = req.body;

    if (req.session.otp === otp) {
        const token = jwt.sign({ email: req.session.email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        });

        return res.redirect("/dashboard"); // Change as needed
    } else {
        return res.render("verify-otp", { message: "Invalid OTP" });
    }
};
