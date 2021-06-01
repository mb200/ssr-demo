import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { request } from '../utils/request';
import Note from '../components/Note';
import Spinner from '../components/Spinner';
import { useLocation } from 'react-router-dom';

export default function NotePage() {
	const { id } = useParams<{ id: string }>();
	const { search } = useLocation();
	const isEditing = new URLSearchParams(search).get('isEditing');

	const { data, isLoading } = useQuery<Note, Error>(['note', id], () => request(`/notes/${id}`));

	if (isLoading) {
		return <Spinner active={isLoading} />;
	}

	if (!data) {
		return null;
	}

	return <Note note={data} isEditing={isEditing === 'true'} />;
}
