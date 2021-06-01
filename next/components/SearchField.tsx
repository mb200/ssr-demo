import { useRouter } from 'next/router';
import { useState } from 'react';

export default function SearchField() {
	const router = useRouter();
	const [text, setText] = useState(router.query.searchText || '');

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
					router.push({
						pathname: router.pathname,
						query: { ...router.query, searchText: newText }
					});
				}}
			/>
		</form>
	);
}
