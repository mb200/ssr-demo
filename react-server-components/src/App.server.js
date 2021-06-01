import React, { Suspense } from 'react';
import EditButton from './components/EditButton.client';
import Note from './components/Note.server';
import NoteList from './components/NoteList.server';
import NoteSkeleton from './components/NoteSkeleton';
import SearchField from './components/SearchField.client';
import SidebarNoteSkeleton from './components/SidebarNoteSkeleton';

export default function App({ selectedId, isEditing, searchText }) {
	return (
		<div className="main">
			<section className="col sidebar">
				<section className="sidebar-header">
					<img
						className="logo"
						src="logo.svg"
						width="22px"
						height="20px"
						alt=""
						role="presentation"
					/>
					<strong>React Notes</strong>
				</section>
				<section className="sidebar-menu" role="menubar">
					<SearchField />
					<EditButton noteId={null}>New</EditButton>
				</section>
				<nav>
					<Suspense fallback={<SidebarNoteSkeleton count={3} />}>
						<NoteList searchText={searchText} />
					</Suspense>
				</nav>
			</section>
			<section key={selectedId} className="col note-viewer">
				<Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
					<Note selectedId={selectedId} isEditing={isEditing} />
				</Suspense>
			</section>
		</div>
	);
}
