const express = require('express')
const router = express.Router();

router.get('/', (req,res)=>{
    res.render('index');
});

router.get('/register', (req,res)=>{
    res.render('register');
});

router.get('/login', (req,res)=>{
    res.render('login');
});

router.get('verify-otp', (req,res)=>{
    res.render('verify-otp');
})

router.get("/dashboard", (req, res) => {
    res.render("dashboard"); 
});

router.get("/more",(req,res)=> {
    res.render("more");
});
module.exports= router;