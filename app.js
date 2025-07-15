const express= require("express");
const mysql = require ("mysql");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dns = require('dns');
const xlsx =require('xlsx');
const hbs = require('hbs');

hbs.registerHelper('gt',(a,b)=> a>b);
hbs.registerHelper('lt',(a,b) => a<b);
hbs.registerHelper('add',(a,b)=> a+b);
hbs.registerHelper('subtract',(a,b)=>a-b);




dotenv.config({path: './.env'});

const app = express();

// setup DNS (for gmail, smtp if needed)
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

app.use(session({
    secret: 'someSecretKey',
    resave:false,
    saveUninitialized:true
}));

app.use(cookieParser());


//set static folder and view engine
const publicDirectory = path.join(__dirname, './public'); //isme we store any frontend code and you need to import it at top
app.use(express.static(publicDirectory));
app.set('view engine','hbs');


//parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//load routes
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))


//start server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
})