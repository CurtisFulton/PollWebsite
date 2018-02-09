const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();

// Routes
const poll = require('./routes/poll');
const api = require('./routes/api');

// Public directory
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use('/poll', poll);
app.use('/api', api);

const port = 3000;

app.listen(port, () => console.log("Listening on port " + port));