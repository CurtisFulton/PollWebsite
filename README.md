# Anonymous Poll

## Synopsis

A simple anonymous polling website using [MaterializeCSS](http://materializecss.com/) to mimic the functionality of [StrawPoll](strawpoll.me). This project was made with functionality as the main priority, so not a lot of time was spent on the UI/UX.

## Live example

*To be added when Project is finished*

## Motivation

I started this project as a way to learn how API development works and also how data persistence works. During my time at University I had already used MySQL before, so I decided to learn PostgreSQL for this project instead. 

## Technologies/Skills used

- Node.js/Express.js
- HTML/CSS
- Javascript/Jquery
- MaterializeCSS
- PostgreSQL
- RESTful API

## Installation

To use this on your own computer you need Node.js and PostgreSQL. 

### The Database

Firstly, the database requires 2 tables `poll` and `poll_vote`. 

#### poll Table

The poll table has 7 columns:

- `poll_id` (PK) \- serial
- `title` \- character varying(255)
- `date_created` \- date
- `multi` \- boolean
- `dup_check` \- enum (`none`, `ip`, `cookie`)
- `votes` \- integer[]
- `options` \- character varying[] (255) 

#### poll_vote Table

The poll table has 3 columns:

- `id` (PK) \- serial
- `user_id` \- integer
- `poll_id` (FK) \- integer.

The poll_id column corresponds to the poll_id column in the poll table.

### The server

To set up the server, clone the git repository and run the command `npm install` to install all dependencies. You will need to add a .env file and fill the following environment variables in:

- `DB_USER` \- Username for the database
- `DB_HOST` \- Host of the database (Most likely localhost)
- `DB_NAME` \- Name of the database
- `DB_PASSWORD` \- Password for the database
- `DB_PORT` \- Port for the database

You can also set the `PORT` variable to change the port for the server if needed.

Once all above steps are completed, run `node server.js` (or nodemon if installed) to start the server. You can access it by going to `localhost:3000`.

## API

**Note:** This project is still in development, so the API is not currently public yet.

### Summary

For the project an API was needed to interact with the poll database. The API can be accessed via `http://poll.curtisfulton.me/api`. All resources will return data in JSON.

### Polls resource

### GET

A specific poll can be retrieved from the API by specifying an ID to the API.

The returned JSON object will return in the following structure:

- `poll_id` \- The ID of the poll.
- `title` \- The title of the poll.
- `date_created` \- The date and time the poll was created (Server time).
- `multi` \- If `true`, the poll will allow users to select multiple options when voting. If `false` the user can only select 1 option when voting.
- `dup_check` \- What kind of duplication checking to do when users vote. Must be `none` or `ip`. Cookie checking will be added in the future.
- `votes` \- The current number of votes for each option. Returned as an array of integers, where the number in each index corresponds to the option in the same index.
- `options` \- Returned as an array of strings, each element in the array represents a possible option in the poll.

#### Example

Retrieve poll data from poll 1

##### Request

`GET https://poll.curtisfulton.me/api/1`

##### Response

```
{
	"poll_id": 1,
	"title": "First poll",
	"date_created": "2018-02-09T14:00:00.000Z",
	"multi": false,
	"dup_check": "ip",
	"votes": [1, 10],
	"options": ["Option 1", "Option 2"]
}
```


### POST

POST can be used to create a new poll. For creating a new poll, you do not specify a poll ID.

The structure of the POST body must be: 

- `title` (Required) \- The title of the poll.
- `options` (Required)\- An array of strings representing the options for the poll
- `multi` \- If left unspecified, will default to `false`.
- `dup_check` \- What kind of duplication checking to do when users vote. If not specified will default to `none`.

The returned JSON object will return in the following structure:

- `poll_id` \- The ID of the poll.
- `title` \- The title of the poll.
- `date_created` \- The date and time the poll was created (Server time).
- `multi` \- If `true`, the poll will allow users to select multiple options when voting. If `false` the user can only select 1 option when voting.
- `dup_check` \- What kind of duplication checking to do when users vote. Must be `none` or `ip`. Cookie checking will be added in the future.
- `votes` \- The current number of votes for each option. Returned as an array of integers, where the number in each index corresponds to the option in the same index.
- `options` \- Returned as an array of strings, each element in the array represents a possible option in the poll.

#### Example

Create a new poll

##### Request

```
POST https://poll.curtisfulton.me/api
{
	"title": "Test Poll",
	"options": ["Option 1", "Option 2", "Option 3"]
	"multi": true
}
```

##### Response

```
{
	"poll_id": 253,
	"title": "Test Poll",
	"date_created": "2018-02-16T14:00:00.000Z",
	"multi": true,
	"dup_check": "none",
	"votes": [0, 0],
	"options": ["Option 1", "Option 2", "Option 3"]
}
```

## License

This project is licensed under the terms of the MIT license.