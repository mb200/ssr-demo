'use strict';

const register = require('react-server-dom-webpack/node-register');
register();
const babelRegister = require('@babel/register');

babelRegister({
	ignore: [/[\\\/](build|server|node_modules)[\\\/]/],
	presets: [['react-app', { runtime: 'automatic' }]],
	plugins: ['@babel/transform-modules-commonjs']
});

const express = require('express');
const compress = require('compression');
const { readFileSync } = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const { pipeToNodeWritable } = require('react-server-dom-webpack/writer');
const React = require('react');
const ReactApp = require('../src/App.server').default;

const PORT = 3000;
const app = express();

app.use(compress());
app.use(express.json());

app.listen(PORT, () => {
	console.log(`React Notes listening at ${PORT}...`);
});

function handleErrors(fn) {
	return async function(req, res, next) {
		try {
			return await fn(req, res);
		} catch (x) {
			next(x);
		}
	};
}

app.get(
	'/',
	handleErrors(async function(_req, res) {
		await waitForWebpack();
		const html = readFileSync(path.resolve(__dirname, '../build/index.html'), 'utf8');
		// Note: this is sending an empty HTML shell, like a client-side-only app.
		// However, the intended solution (which isn't built out yet) is to read
		// = require(the Server endpoint and turn its response into an HTML stream.
		res.send(html);
	})
);

async function renderReactTree(res, props) {
	await waitForWebpack();
	const manifest = readFileSync(
		path.resolve(__dirname, '../build/react-client-manifest.json'),
		'utf8'
	);
	const moduleMap = JSON.parse(manifest);
	pipeToNodeWritable(React.createElement(ReactApp, props), res, moduleMap);
}

function sendResponse(req, res, redirectToId) {
	const location = JSON.parse(req.query.location);
	if (redirectToId) {
		location.selectedId = redirectToId;
	}
	res.set('X-Location', JSON.stringify(location));
	renderReactTree(res, {
		selectedId: location.selectedId,
		isEditing: location.isEditing,
		searchText: location.searchText
	});
}

async function relay(url, init) {
	const apiPath = url.replace(/^\//g, '');
	return fetch(`http://localhost:5000/${apiPath}`, {
		...init,
		headers: {
			'content-type': 'application/json'
		}
	}).then((r) => {
		try {
			return r.json();
		} catch (e) {
			console.error(e);
			return Promise.resolve();
		}
	});
}

app.get('/react', function(req, res) {
	sendResponse(req, res, null);
});

app.post(
	'/notes',
	handleErrors(async function(req, res) {
		const body = JSON.stringify(req.body);
		const note = await relay('/notes', { method: 'POST', body });
		const insertedId = note.id;

		sendResponse(req, res, insertedId);
	})
);

app.put(
	'/notes/:id',
	handleErrors(async function(req, res) {
		const body = JSON.stringify(req.body);
		await relay(req.url, { method: 'PUT', body });

		sendResponse(req, res, null);
	})
);

app.delete(
	'/notes/:id',
	handleErrors(async function(req, res) {
		await relay(`/notes/${req.params.id}`, { method: 'DELETE' });

		sendResponse(req, res, null);
	})
);

app.get(
	'/notes',
	handleErrors(async function(req, res) {
		const rows = await relay(req.url);

		res.json(rows);
	})
);

app.get(
	'/notes/:id',
	handleErrors(async function(req, res) {
		const row = await relay(req.url);

		res.json(row);
	})
);

app.get('/sleep/:ms', async function(req, res) {
	await relay(req.url);

	res.json({ ok: true });
});

app.use(express.static('build'));
app.use(express.static('public'));

app.on('error', function(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
});

async function waitForWebpack() {
	while (true) {
		try {
			readFileSync(path.resolve(__dirname, '../build/index.html'));
			return;
		} catch (err) {
			console.log('Could not find webpack build output. Will retry in a second...');
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}
