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

// Checks if the user has already voted
function userHasVoted(id) {
	// Nothing here yet.

	return false;
}

module.exports = {
	getPoll : getPoll,
};