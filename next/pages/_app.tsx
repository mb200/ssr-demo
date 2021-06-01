import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../components/Layout';

const client = new QueryClient();

function NextDemoApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>React Notes</title>
				<meta name="description" content="React with Server Components demo" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="stylesheet" href="/style.css" />
			</Head>
			<div className="app">
				<QueryClientProvider client={client}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</QueryClientProvider>
			</div>
		</>
	);
}

export default NextDemoApp;
