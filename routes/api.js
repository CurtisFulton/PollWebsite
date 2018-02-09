const express = require('express');
const router = express.Router();

const db = require('../database/index.js');

router.get('/', (req, res) => {
	res.send('Welcome to the StrawPoll clone API');
});

router.get('/:id', (req, res, next) => {
	db.getPoll(req.params.id)
	.then(result => {
		res.send(result);
	})
	.catch(e => res.send("Error, " + e));
});

router.post('/:id', (req, res, next) => {
	res.send("Thank you for sending a post request...");
});

module.exports = router;