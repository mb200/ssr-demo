/// <reference types="react-scripts" />

type Note = {
	id: number;
	title: string;
	body: string;
	updated_at: number;
};

declare module 'excerpts' {
	export default function (str: string, opts: { words: number }): string;
}
