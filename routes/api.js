const express = require('express');
const router = express.Router();

const db = require('../database/index.js');

router.get('/', (req, res) => {
	res.send('Welcome to the StrawPoll clone API');
});

router.get('/polls/:id', (req, res, next) => {
	db.getPoll(req.params.id)
	.then(result => {
		res.send(result);
	})
	.catch(e => res.send("Error, " + e));
});

function validatePoll(req, res, next) {
	let poll = req.body;
	let errors = [] 

	if (!poll.title) {
		errors.push('You must supply a title for the poll');
	}

	if (!poll.options || poll.options.length < 2) {
		errors.push('Enter at least 2 options for the poll');
	}

	if (errors.length > 0) {
		req.flash('error', errors);
		res.redirect('/');
	} else {
		next();
	}
}

router.post('/polls', validatePoll, (req, res) => {
	console.log(req.body)
});

module.exports = router;