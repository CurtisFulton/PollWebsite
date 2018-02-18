const express = require('express');
const path = require('path');

require('dotenv').config();

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('req-flash');

const app = express();

// Routes
const poll = require('./routes/poll');
const api = require('./routes/api');

// Public directory
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(cookieParser());
app.use(session({ secret : '123', resave : false, saveUninitialized : true }));
app.use(flash());

app.use('/favicon.ico', () => {});
app.use('/', poll);
app.use('/api', api);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Listening on port " + port));