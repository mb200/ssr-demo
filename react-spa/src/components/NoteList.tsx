import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import { request } from '../utils/request';
import SidebarNote from './SidebarNote';
import SidebarNoteSkeleton from './SidebarNoteSkeleton';

function fetchNotes(query?: string) {
	const searchText = query || '';

	return request(`/notes?searchText=${searchText}`);
}

function NoteList() {
	const { search } = useLocation();
	const searchText = new URLSearchParams(search).get('searchText');

	// Run this query client side.
	const { data: notes, isLoading } = useQuery<Note[], Error>(
		['notes', searchText],
		() => fetchNotes(searchText as string),
		{ keepPreviousData: true }
	);

	if (isLoading) {
		return <SidebarNoteSkeleton />;
	}

	return !!notes && notes.length > 0 ? (
		<ul className="notes-list">
			{notes.map((note) => (
				<li key={note.id}>
					<SidebarNote note={note} />
				</li>
			))}
		</ul>
	) : (
		<div className="notes-empty">
			{searchText ? `Couldn't find any notes titled "${searchText}".` : 'No notes created yet!'}
		</div>
	);
}

export { NoteList };
