const { Pool } = require('pg');

// Completely insecure, but this is for internal demo only.
const credentials = {
	host: process.env.DB_HOST || 'localhost',
	database: 'notesapi',
	user: 'notesadmin',
	password: 'password',
	port: 5432
};

/**
 * Global is used here to ensure the connection
 * is cached across hot-reloads in development
 *
 * see https://github.com/vercel/next.js/discussions/12229#discussioncomment-83372
 */
let cached = global.pool;
if (!cached) cached = global.pool = {};

function getPool() {
	if (!cached.instance) cached.instance = new Pool(credentials);

	return cached.instance;
}

module.exports = { getPool };
