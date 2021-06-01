import { unstable_useTransition, useEffect, useRef, useState } from 'react';
import { useLocation } from '../context/LocationContext.client';

export default function ClientSidebarNote({ id, title, children, expandedChildren }) {
	const [location, setLocation] = useLocation();
	const [startTransition, isPending] = unstable_useTransition();
	const [isExpanded, setIsExpanded] = useState(false);
	const isActive = id === location.selectedId;

	// Animate after title is edited.
	const itemRef = useRef(null);
	const prevTitleRef = useRef(title);
	useEffect(() => {
		if (title !== prevTitleRef.current) {
			prevTitleRef.current = title;
			itemRef.current.classList.add('flash');
		}
	}, [title]);

	return (
		<div
			ref={itemRef}
			onAnimationEnd={() => {
				itemRef.current.classList.remove('flash');
			}}
			className={['sidebar-note-list-item', isExpanded ? 'note-expanded' : ''].join(' ')}
		>
			{children}
			<button
				className="sidebar-note-open"
				style={{
					backgroundColor: isPending ? 'var(--gray-80)' : isActive ? 'var(--tertiary-blue)' : '',
					border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent'
				}}
				onClick={() => {
					startTransition(() => {
						setLocation((loc) => ({
							selectedId: id,
							isEditing: false,
							searchText: loc.searchText
						}));
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
					<img src="chevron-down.svg" width="10px" height="10px" alt="Collapse" />
				) : (
					<img src="chevron-up.svg" width="10px" height="10px" alt="Expand" />
				)}
			</button>
			{isExpanded && expandedChildren}
		</div>
	);
}
