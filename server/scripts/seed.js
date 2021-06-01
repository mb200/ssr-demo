'use strict';

const startOfYear = require('date-fns/startOfYear');
const { getPool } = require('../db');

const pool = getPool();
const now = new Date();
const startOfThisYear = startOfYear(now);

// Thanks, https://stackoverflow.com/a/9035732
function randomDateBetween(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const dropTableStatement = 'DROP TABLE IF EXISTS notes;';
const createTableStatement = `CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT
);`;
const insertNoteStatement = `INSERT INTO notes(title, body, created_at, updated_at)
  VALUES ($1, $2, $3, $3)
  RETURNING *`;
const seedData = [
	[
		'Meeting Notes',
		'This is an example note. It contains **Markdown**!',
		randomDateBetween(startOfThisYear, now)
	],
	[
		'Make a thing',
		`It's very easy to make some words **bold** and other words *italic* with
Markdown. You can even [link to React's website!](https://www.reactjs.org).`,
		randomDateBetween(startOfThisYear, now)
	],
	[
		'A note with a very long title because sometimes you need more words',
		`You can write all kinds of [amazing](https://en.wikipedia.org/wiki/The_Amazing)
notes in this app! These note live on the server in the \`notes\` folder.

![This app is powered by React](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/React_Native_Logo.png/800px-React_Native_Logo.png)`,
		randomDateBetween(startOfThisYear, now)
	],
	['I wrote this note today', 'It was an excellent note.', now]
];

async function seed() {
	await pool.query(dropTableStatement);
	await pool.query(createTableStatement);
	return Promise.all(seedData.map((row) => pool.query(insertNoteStatement, row)));
}

seed();
