const express= require("express");
const mysql = require ("mysql");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");

dotenv.config({path: './.env'});

const app = express();

app.use(session({
    secret: 'someSecretKey',
    resave:false,
    saveUninitialized:true
}));

app.use(cookieParser());



const db = mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
     port: process.env.DATABASE_PORT
}); 


const publicDirectory = path.join(__dirname, './public'); //isme we store any frontend code and you need to import it at top

app.use(express.static(publicDirectory));
app.set('view engine','hbs');

db.connect((error)=> {
if(error){
    console.log(error)
}else{
    console.log("MYSQL Connected...")
}
})
//define routes


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
