import React from 'react';
import { fetch } from 'react-fetch';
import SidebarNote from './SidebarNote';

export default function NoteList({ searchText }) {
	const notes = fetch(`http://localhost:3000/notes?searchText=${searchText}`).json();

	// Now let's see how the Suspense boundary above lets us not block on this.
	// fetch('http://localhost:3000/sleep/3000');

	return notes.length > 0 ? (
		<ul className="notes-list">
			{notes.map((note) => (
				<li key={note.id}>
					<SidebarNote note={note} />
				</li>
			))}
		</ul>
	) : (
		<div className="notes-empty">
			{searchText ? `Couldn't find any notes titled "${searchText}".` : 'No notes created yet!'}{' '}
		</div>
	);
}
