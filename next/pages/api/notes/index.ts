import { NextApiRequest, NextApiResponse } from 'next';
import { relay } from '../../../utils/request';

export default async function notesHandler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		case 'GET': {
			const { searchText = '' } = req.query;
			const rows = await relay(`/notes?searchText=${searchText}`);
			return res.status(200).json(rows);
		}
		case 'POST': {
			const note = await relay('/notes', { method: 'POST', body: JSON.stringify(req.body) });
			return res.status(200).json(note);
		}
		default:
			return res.status(400).json({ error: `Unsupported HTTP method ${req.method}` });
	}
}
