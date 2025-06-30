require ('dotenv').config();
const mysql = require('mysql2');


const db = mysql.createConnection({
database: process.env.DATABASE,
host:process.env.DATABASE_HOST,
user:process.env.DATABASE_USER,
password:process.env.DATABASE_PASSWORD,
port:process.env.DATABASE_PORT
});

db.connect((error)=>{
    if(error){
        console.error('MySQL connection failed', error.message);

    }else{
        console.log('MySQL connection successful');
    }
});

module.exports = db;