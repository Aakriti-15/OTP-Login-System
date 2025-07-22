const db = require('../db');

exports.getForm = (req, res) => {
  const email = req.session.user.email;
  const items = req.query.items;
  if (items) {
    const latest = items.split(',').map(item => item.trim());
    return res.render('grocery', { latestList: latest });
  }
  db.query('SELECT * FROM grocery_lists WHERE email = ? ORDER BY date DESC LIMIT 1', [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const latest = results[0].items.split(',').map(item => item.trim());
      res.render('grocery', { latestList: latest });
    } else {
      res.render('grocery');
    }
  });
};


exports.saveList=(req,res)=>{
    const items = req.body.items;
    const email = req.session.user.email;
    const date = new Date();

    db.query('insert into grocery_lists(email,date,items) values (?,?,?)',[email,date, items], (err)=>{
        if (err) throw err;
        res.redirect('/grocery');
    }
);

;}