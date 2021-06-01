import React from 'react';
import EditButton from './EditButton';
import { NoteList } from './NoteList';
import SearchField from './SearchField';

const Layout: React.FC = ({ children }) => {
	return (
		<div className="main">
			<section className="col sidebar">
				<section className="sidebar-header">
					<img
						className="logo"
						src="/logo.svg"
						width="22px"
						height="20px"
						alt="logo"
						role="presentation"
					/>
					<strong>React Notes</strong>
				</section>
				<section className="sidebar-menu" role="menubar">
					<SearchField />
					<EditButton noteId={null}>New</EditButton>
				</section>
				<nav>
					<NoteList />
				</nav>
			</section>
			<section className="col note-viewer">{children}</section>
		</div>
	);
};

export default Layout;
