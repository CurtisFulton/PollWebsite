const connectionString = 'postgresql://Curtis:Zmxncbv109@localhost:5432/poll-db'
var { Pool } = require('pg');

const pool = new Pool({
  user: 'Curtis',
  host: 'localhost',
  database: 'poll-db',
  password: 'Zmxncbv109',
  port: 5432,
});

/********************************/
/*			DB queries			*/
/********************************/

// Returns only the poll information for that poll
function getPoll(id) {
	return new Promise((resolve, reject) => {
		pool.query('SELECT * FROM poll WHERE poll.poll_id = $1', [id])
		.then(result => {
			if (result.rows.length == 0){
				reject("No polls with that ID");
			}

			resolve(result.rows[0]);
		})
		.catch(e => reject(e));
	});
}

// Inserts a new Poll into the db
function createPoll(poll) {
	return new Promise((resolve, reject) => {
		pool.query('INSERT INTO poll (title, options, votes, date_created, multi, dup_check) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
			[poll.title, poll.options, poll.votes, poll.date, poll.multi, poll.dupCheck])
		.then(result => {
			resolve(result.rows[0]);
		})
		.catch(e => reject(e));
	});
}

// Inserts a new Poll into the db
function voteOnPoll(pollID, votes) {
	let query = 'UPDATE poll SET votes = (SELECT array_agg(vote) FROM ( SELECT title, (unnest(votes)::integer + unnest($2::integer[])::integer) AS vote FROM poll WHERE poll_id = $1) as unnested_vote) WHERE poll_id = $1'

	return new Promise((resolve, reject) => {
		pool.query(query, [pollID, votes])
		.then(result => {
			resolve(result.rows[0]);
		})
		.catch(e => reject(e));
	});
}

// Checks if the user has already voted
function userHasVoted(id) {
	// Nothing here yet.

	return false;
}

module.exports = {
	getPoll : getPoll,
	createPoll : createPoll,
	voteOnPoll : voteOnPoll,
};