function makeFetch(base: string) {
	return async function customFetch(path: string, init?: RequestInit) {
		const apiPath = path.replace(/^\//g, '');
		const basePath = base.replace(/\/$/g, '');
		const url = `${basePath}/${apiPath}`;

		return fetch(url, {
			...init,
			headers: {
				'content-type': 'application/json'
			}
		}).then((r) => {
			try {
				return r.json();
			} catch (e) {
				console.error(e);
				return Promise.resolve();
			}
		});
	};
}

const request = makeFetch('http://localhost:5000');

export { request };
