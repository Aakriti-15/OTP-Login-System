const db = require('../db');

exports.showTracker = (req, res) => {
  const email = req.session.userEmail;

  db.query('SELECT * FROM symptom_logs WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error fetching logs:', err);
      return res.render('tracker', { logs: [], error: 'Failed to load logs' });
    }

    // Format date into short readable form
    const logs = results.map(log => {
      const formattedDate = new Date(log.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }); // Example: 16 Jul 2025

      return {
        ...log,
        date: formattedDate
      };
    });

    res.render('tracker', { logs });
  });
};

exports.saveLog = (req, res) => {
  const { cramps, mood, flow } = req.body;
  const email = req.session.userEmail;

  if (!email || !cramps || !mood || !flow) {
    return res.render('tracker', { error: 'Please fill all fields properly' });
  }

  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const sql = 'INSERT INTO symptom_logs (email, date, cramps, mood, flow) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [email, formattedDate, cramps, mood, flow], (err) => {
    if (err) {
      console.error('Insert error:', err);
      return res.render('tracker', { error: 'Could not save your log' });
    }

    // After saving, fetch logs again with formatted dates
    db.query('SELECT * FROM symptom_logs WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Fetch error after insert:', err);
        return res.render('tracker', { logs: [], success: 'Log saved, but could not fetch previous logs' });
      }

      const logs = results.map(log => {
        const formattedDate = new Date(log.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        return { ...log, date: formattedDate };
      });

      res.render('tracker', { success: 'Log saved successfully', logs });
    });
  });
};
