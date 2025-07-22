const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dns = require('dns');
const xlsx = require('xlsx');
const hbs = require('hbs');

dotenv.config({ path: './.env' });
const app = express();

// DNS setup (optional)
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

// Handlebars helpers for pagination
hbs.registerHelper('gt', (a, b) => a > b);
hbs.registerHelper('lt', (a, b) => a < b);
hbs.registerHelper('add', (a, b) => a + b);
hbs.registerHelper('subtract', (a, b) => a - b);


hbs.registerHelper('formatDate', function (datetime) {
  if (!datetime) return '';
  const date = new Date(datetime);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
});


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'someSecretKey',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Serve static assets from "public"
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Route files
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/diet'));
app.use('/', require('./routes/tracker'));
app.use('/', require('./routes/consult'));
app.use('/', require('./routes/grocery'));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
