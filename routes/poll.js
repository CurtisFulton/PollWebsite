const express = require('express');
const router = express.Router();

const request = require('request');

router.get('/', (req, res) => {
	res.render('index', { errors : req.flash('error') });
});

router.get('/:id', (req, res) => {
	requestPoll(req.params.id)
	.then(poll => {
		res.render('poll', {
			id : poll.poll_id,
			title : poll.title,
			options : poll.options,
			multi : poll.multi
		});
	})
	.catch(err => {
		next();
	});
});

router.get('/:id/r', (req, res, next) => {
	requestPoll(req.params.id)
	.then(poll => {
		let totalVotes = poll.votes.reduce((sum, current) => (sum + current), 0);

		res.render('result', {
			id : poll.poll_id,
			title : poll.title,
			options : poll.options,
			votes : poll.votes,
			totalVotes : totalVotes
		});
	})
	.catch(err => {
		next();
	});
});

function requestPoll(id) {
	var reqURL = 'http://localhost:3000/api/polls/' + id;

	return new Promise((resolve, reject) => {
		request(reqURL, function(err, response, body) {
			if (err) 
				reject(err);
			else {
				resolve(JSON.parse(body));
			}
		});
	});


}

module.exports = router;