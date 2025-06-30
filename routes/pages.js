const express = require('express')
const router = express.Router();
const upload = require('../upload');
const xlsx = require('xlsx');
const db = require('../db');
const bcrypt= require('bcryptjs');
router.get('/', (req,res)=>{
    res.render('index');
});

router.get('/register', (req,res)=>{
    res.render('register');
});

router.get('/login', (req,res)=>{
    res.render('login');
});

router.get('/verify-otp', (req,res)=>{
    res.render('verify-otp');
})

 router.get("/dashboard", (req, res) => {
    res.render("dashboard"); 
 });

router.get("/more",(req,res)=> {
    res.render("more");
});

// this file is rendering to different routes based on ki kaha pe request to direct krna h

router.post('/upload-excel' , upload.single('excel'), (req, res)=>{
    // try{
        
        
        const workbook = xlsx.read(req.file.buffer, {type:'buffer'});
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const data = xlsx.utils.sheet_to_json(sheet);
        console.log("Parsed Data",data);
       
         
        if(data.length===0){
            return res.render('dashboard',{error : 'Excel file is empty', success : null});
        }

        data.forEach((row)=>{
            const{name,email,password}= row;
          const hashedPassword=bcrypt.hashSync(String(password), 10)
          console.log('Row', row);
    if(name && email && password){
                db.query('insert into loginuser (name,email,password) values(?,?,?)',[name,email,hashedPassword], (err)=>{
                    if(err){
                    console.error(err)
                    }
                });
            }
        });
        res.render('dashboard',{error : null, success : 'Excel file uploaded successfully'});
    } //catch(err){
    //    console.log("❌ Catch Error:", err);  // This will now print the actual error
    // res.render('dashboard', {
    //   success: null,
    //   error: 'Upload failed: ' + (err?.message || 'Something went wrong')
    // }); 
    // }
);


router.get('/export-excel',(req,res)=>{
    db.query('select name, email from loginuser',(err,results)=>{
        if(err){
            console.error('DB error',err);
            return res.status(500).send('failed to fetch data');
        }
        const worksheet =xlsx.utils.json_to_sheet(results);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook,worksheet,'Users');
        const buffer = xlsx.write(workbook,{type:'buffer', booktype:'xlsx'});

        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.send(buffer);
    });
});
module.exports= router;