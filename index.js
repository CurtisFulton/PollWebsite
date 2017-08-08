const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

// View engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(function(req, res, next) {
	res.locals.errors = null;
	next();
});

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());

const apiRouter = require('./routes/poll-api.js');
const pollRouter = require('./routes/poll.js');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(expressValidator({
	customValidators: {
		isArray: function(value) {
			return Array.isArray(value)
		},
		validStrings: function(array, value) {
			var valid = 0;
			
			array.forEach(function(val){
				if (val != null && val.length > 0)
					valid++;
			});

			return valid >= value;
		},
		eachNotEmpty: function(values) {
			return values.every(function(val){
				return val != null && val.length > 0;
			});
		}
	}
}));

// Default portfolio page
app.get('/', function(req, res, next) {
	res.render('home', {
		title : "Poll - Portfolio"
	});
});

app.use('/api', apiRouter);
app.use('/polls', pollRouter);


app.listen(8080, function() {
	console.log('Server Online. Port: ' + 8080);
});


exports.app = app;