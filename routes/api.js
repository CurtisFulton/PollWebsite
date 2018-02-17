const express = require('express');
const router = express.Router();

const db = require('../database/index.js');

router.get('/', (req, res) => {
	res.send('Welcome to the StrawPoll clone API');
});

router.get('/polls/:id', (req, res, next) => {
	db.getPoll(req.params.id)
	.then(result => {
		res.json(result);
	})
	.catch(e => res.send("Error, " + e));
});

router.post('/polls', validatePoll, (req, res) => {
	db.createPoll(req.poll)
	.then(result => {
		res.redirect('/' + result.poll_id);
	})
	.catch(e => {
		console.log(e);
	})
});

router.post('/polls/:id', async (req, res) => {
	let resultsURL = '/' + req.params.id + '/r';

	let vote;

	if (!(req.body.vote instanceof Array)){
		vote = new Array(1);
		vote[0] = parseInt(req.body.vote);
	} else {
		vote = req.body.vote.map((e) => {
			return parseInt(e);
		});
	}

	let pollID = req.params.id;
	let userID = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace(/\D/g, '');

	try {
		let hasVoted = false;
		let poll = await db.getPoll(pollID);
		let checkVote = poll.dup_check == 'ip' || poll.dup_check == 'cookie';

		if (checkVote) {
			hasVoted = await db.userHasVoted(pollID, userID);
		}
		
		if (!hasVoted){
			if (checkVote && req.body.vote) {
				db.addUserID(pollID, userID);
			}

			let votesObj = new Array(poll.options.length);

			for (var i = 0; i < votesObj.length; i++) {
				if (vote.includes(i))
					votesObj[i] = 1;
				else
					votesObj[i] = 0;
			}

			var test = await db.voteOnPoll(req.params.id, votesObj);
		}
	} catch(e) {
		console.log(e);
	}

	res.redirect(resultsURL);
});

function validatePoll(req, res, next) {
	let poll = req.body;
	let errors = [] 

	// Remove any empty strings
	for (let i = poll.option.length - 1; i >= 0 ; i--) {
		if (poll.option[i].trim() == 0) 
			poll.option.splice(i, 1);
	}

	if (!poll.title) {
		errors.push('You must supply a title for the poll');
	}

	if (!poll.option || poll.option.length < 2) {
		errors.push('Enter at least 2 options for the poll');
	}

	if (errors.length > 0) {
		req.flash('error', errors);
		res.redirect('/');
	} else {
		req.poll = createPollObject(poll.title, poll.option, new Date(), poll.multi, poll.dupCheck);
		next();
	}
}

function createPollObject(title, options, date, multi, dupCheck) {
	let votes = new Array(options.length);
	let dateObj = date || new Date();

	for (var i = 0; i <  votes.length; i++) {
		 votes[i] = 0;
	}

	return {
		title : title,
		options : options,
		votes : votes,
		date : dateObj,
		multi : multi || false,
		dupCheck : dupCheck || "none"
	}
}


module.exports = router;