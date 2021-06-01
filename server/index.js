const express = require('express');
const cors = require('cors');
const { NoteModel } = require('./models/note');

const PORT = process.env.PORT || 5000;
const app = express();
const noteModel = new NoteModel();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}...`);
});

function handleErrors(fn) {
	return async function (req, res, next) {
		try {
			return await fn(req, res);
		} catch (x) {
			next(x);
		}
	};
}

app.post(
	'/notes',
	handleErrors(async function (req, res) {
		const { title, body } = req.body;
		const { rows } = await noteModel.insert({ title, body });
		const note = rows[0];

		return res.json(note);
	})
);

app.put(
	'/notes/:id',
	handleErrors(async function (req, res) {
		const id = Number(req.params.id);
		const { rows } = await noteModel.update(id, req.body);
		const note = rows[0];

		return res.json(note);
	})
);

app.delete(
	'/notes/:id',
	handleErrors(async function (req, res) {
		await noteModel.delete(req.params.id);

		return res.json({ ok: true });
	})
);

app.get(
	'/notes',
	handleErrors(async function (req, res) {
		const { rows } = await noteModel.select({ title: req.query.searchText });

		return res.json(rows);
	})
);

app.get(
	'/notes/:id',
	handleErrors(async function (req, res) {
		const { rows } = await noteModel.select({ id: req.params.id });

		return res.json(rows[0]);
	})
);

app.get('/sleep/:ms', function (req, res) {
	setTimeout(() => {
		res.json({ ok: true });
	}, Number(req.params.ms));
});

app.on('error', function (error) {
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
