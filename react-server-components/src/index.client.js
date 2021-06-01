import { Suspense, useState } from 'react';
import { unstable_createRoot } from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useServerResponse } from './Cache.client';
import { LocationContext } from './context/LocationContext.client';

export default function Root({ initialCache }) {
	return (
		<Suspense fallback={null}>
			<ErrorBoundary FallbackComponent={Error}>
				<Content />
			</ErrorBoundary>
		</Suspense>
	);
}

function Content() {
	const [location, setLocation] = useState({
		selectedId: null,
		isEditing: false,
		searchText: ''
	});
	const response = useServerResponse(location);
	return (
		<LocationContext.Provider value={[location, setLocation]}>
			{response.readRoot()}
		</LocationContext.Provider>
	);
}

function Error({ error }) {
	return (
		<div>
			<h1>Application Error</h1>
			<pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
		</div>
	);
}

const initialCache = new Map();
const root = unstable_createRoot(document.getElementById('root'));

root.render(<Root initialCache={initialCache} />);
