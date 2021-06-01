import { useState } from 'react';

type Options = {
	endpoint: string;
	method: 'GET' | 'PUT' | 'POST' | 'DELETE';
};

function useMutation<A, T>(args: Options): [boolean, (args: A) => Promise<T>] {
	const { endpoint, method } = args;
	const [isSaving, setIsSaving] = useState(false);

	async function performMutation(payload: A) {
		setIsSaving(true);
		try {
			const response = await fetch(endpoint, {
				method,
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			return response.json();
		} catch (e) {
			console.error(e);
		} finally {
			setIsSaving(false);
		}
	}

	return [isSaving, performMutation];
}

export { useMutation };
