import React from 'react';
import { useLocation } from 'react-router-dom';
import Note from '../components/Note';

export default function HomePage() {
	const { search } = useLocation();
	const isEditing = new URLSearchParams(search).get('isEditing');

	return <Note note={null} isEditing={isEditing === 'true'} />;
}
