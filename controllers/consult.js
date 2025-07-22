const db = require('../db');

exports.getForm = (req,res)=>{
    const user = req.session.user;
    db.query('SELECT * from consult_requests where email =?',[user.email],(err, results)=>{
        if (err) throw err;
        res.render('consult',{requests:results});
    })
}


exports.submitRequest = (req, res)=>{
    const{doctor , reason}= req.body;
    const email = req.session.user.email;
    const date = new Date();

    db.query(
        'insert into consult_requests(email,doctor,reason,date) values(?,?,?,?)',
        [email,doctor,reason,date],
        (err)=>{
            if(err) throw err;
            res.redirect('/consult');
        }
    );
};