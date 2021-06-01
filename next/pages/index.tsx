import { useRouter } from 'next/router';
import React from 'react';
import Note from '../components/Note';

export default function HomePage() {
	const router = useRouter();
	const { isEditing } = router.query;

	return <Note note={null} isEditing={isEditing === 'true'} />;
}
