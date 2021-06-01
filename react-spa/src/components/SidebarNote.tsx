import { format, isToday } from 'date-fns';
import excerpts from 'excerpts';
import marked from 'marked';
import { useEffect, useRef, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { useHistory } from 'react-router-dom';

type Props = {
	note: Note;
};

export default function ClientSidebarNote({ note }: Props) {
	const history = useHistory();
	const match = useRouteMatch<{ id: string }>('/notes/:id');

	const isActive = note.id === Number(match?.params.id);

	const updatedAt = new Date(note.updated_at);
	const lastUpdatedAt = isToday(updatedAt)
		? format(updatedAt, 'h:mm bb')
		: format(updatedAt, 'M/d/yy');
	const summary = excerpts(marked(note.body || ''), { words: 20 });

	const [isExpanded, setIsExpanded] = useState(false);

	// Animate after title is edited.
	const itemRef = useRef<HTMLDivElement>(null);
	const prevTitleRef = useRef(note.title);
	useEffect(() => {
		if (note.title !== prevTitleRef.current) {
			prevTitleRef.current = note.title;
			itemRef.current?.classList.add('flash');
		}
	}, [note.title]);

	return (
		<div
			ref={itemRef}
			onAnimationEnd={() => {
				itemRef.current?.classList.remove('flash');
			}}
			className={['sidebar-note-list-item', isExpanded ? 'note-expanded' : ''].join(' ')}
		>
			<header className="sidebar-note-header">
				<strong>{note.title}</strong>
				<small>{lastUpdatedAt}</small>
			</header>
			<button
				className="sidebar-note-open"
				style={{
					backgroundColor: isActive ? 'var(--tertiary-blue)' : '',
					border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent'
				}}
				onClick={() => {
					const search = new URLSearchParams({ isEditing: 'false' });
					history.push({
						pathname: `/notes/${note.id}`,
						search: search.toString()
					});
				}}
			>
				Open note for preview
			</button>
			<button
				className="sidebar-note-toggle-expand"
				onClick={(e) => {
					e.stopPropagation();
					setIsExpanded(!isExpanded);
				}}
			>
				{isExpanded ? (
					<img src="/chevron-down.svg" width="10px" height="10px" alt="Collapse" />
				) : (
					<img src="/chevron-up.svg" width="10px" height="10px" alt="Expand" />
				)}
			</button>
			{isExpanded && <p className="sidebar-note-excerpt">{summary || <i>(No content)</i>}</p>}
		</div>
	);
}
