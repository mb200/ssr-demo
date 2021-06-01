import { GetServerSideProps } from 'next';
import React from 'react';
import Note from '../../components/Note';
import { request } from '../../utils/request';

type PageProps = {
	note: Note;
	isEditing: boolean;
};

export default function NotePage(props: PageProps) {
	return <Note {...props} />;
}

type Context = {
	id: string;
};

export const getServerSideProps: GetServerSideProps<PageProps, Context> = async (context) => {
	const { isEditing } = context.query;
	const id = context.params?.id;

	const note = await request(`/api/notes/${id}`);

	return {
		props: {
			note,
			isEditing: isEditing === 'true'
		}
	};
};
