import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';

export default function SearchField() {
	const history = useHistory();
	const { pathname, search } = useLocation();
	const searchParams = new URLSearchParams(search);
	const searchText = searchParams.get('searchText');

	const [text, setText] = useState(searchText || '');

	return (
		<form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
			<label className="offscreen" htmlFor="sidebar-search-input">
				Search for a note by title
			</label>
			<input
				id="sidebar-search-input"
				placeholder="Search"
				value={text}
				onChange={(e) => {
					const newText = e.target.value;
					setText(newText);
					searchParams.set('searchText', newText);
					history.push({
						pathname,
						search: searchParams.toString()
					});
				}}
			/>
		</form>
	);
}
