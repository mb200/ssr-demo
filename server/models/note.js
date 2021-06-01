const { getPool } = require('../db');

const pool = getPool();

class NoteModel {
	async select(where) {
		let clause = '';
		if (where) {
			const { id, title } = where;
			clause = [id && `id = ${id}`, title && `title ilike '%${title}%'`]
				.filter(Boolean)
				.join(' and ');
		}

		const query = clause ? `select * from notes where ${clause}` : 'select * from notes';
		return pool.query(`${query} order by id desc`);
	}

	async update(id, patch) {
		const { title, body } = patch;
		const now = new Date();

		return pool.query(
			'update notes set title = $1, body = $2, updated_at = $3 where id = $4 returning *',
			[title, body, now, id]
		);
	}

	async insert(patch) {
		const now = new Date();
		return pool.query(
			'insert into notes (title, body, created_at, updated_at) values ($1, $2, $3, $3) returning *',
			[patch.title, patch.body, now]
		);
	}

	async delete(id) {
		return pool.query('delete from notes where id = $1 returning *', [id]);
	}
}

module.exports = { NoteModel };
