import React, { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route } from 'react-router-dom';
import EditButton from './components/EditButton';
import { NoteList } from './components/NoteList';
import SearchField from './components/SearchField';
import Spinner from './components/Spinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const NotePage = lazy(() => import('./pages/NotePage'));
const client = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={client}>
			<BrowserRouter>
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
					<section className="col note-viewer">
						<Suspense fallback={<Spinner active />}>
							<Route path="/" exact component={HomePage} />
						</Suspense>
						<Suspense fallback={<Spinner active />}>
							<Route path="/notes/:id" exact component={NotePage} />
						</Suspense>
					</section>
				</div>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
