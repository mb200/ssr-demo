import { NextApiRequest, NextApiResponse } from 'next';
import { relay } from '../../../utils/request';

export default async function notesHandler(req: NextApiRequest, res: NextApiResponse) {
	const id = Number(req.query.id);

	if (!id) {
		return res.status(400).json({ error: 'Note ID is required.' });
	}

	const url = `/notes/${id}`;

	switch (req.method) {
		case 'GET': {
			const note = await relay(url);
			return res.status(200).json(note);
		}
		case 'PUT': {
			const note = await relay(url, { method: 'PUT', body: JSON.stringify(req.body) });
			return res.status(200).json(note);
		}
		case 'DELETE': {
			await relay(url, { method: 'DELETE' });
			return res.status(200).json({ success: true });
		}
		default:
			return res.status(400).json({ error: `Unsupported HTTP method ${req.method}` });
	}
}
