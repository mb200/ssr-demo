import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import NotePreview from '../components/NotePreview';
import { useMutation } from '../hooks/useMutation';

type Props = {
	noteId: number | null;
	initialTitle?: string;
	initialBody?: string;
};

type EditArgs = Pick<Note, 'title' | 'body'>;

export default function NoteEditor({ noteId, initialTitle = '', initialBody = '' }: Props) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const query = router.query;

	const [title, setTitle] = useState(initialTitle);
	const [body, setBody] = useState(initialBody);

	const [isSaving, saveNote] = useMutation<EditArgs, Note>({
		endpoint: noteId !== null ? `/api/notes/${noteId}` : `/api/notes`,
		method: noteId !== null ? 'PUT' : 'POST'
	});

	const [isDeleting, deleteNote] = useMutation<void, Note>({
		endpoint: `/api/notes/${noteId}`,
		method: 'DELETE'
	});

	async function handleSave(payload: { title: string; body: string }) {
		const newNote = await saveNote(payload);
		const id = newNote.id || noteId;

		await queryClient.invalidateQueries(['/api/notes']);
		navigate(`/notes/${id}`, { isEditing: false });
	}

	async function handleDelete() {
		await deleteNote();
		await queryClient.invalidateQueries(['/api/notes']);
		navigate('/', { searchText: query.searchText });
	}

	function navigate(pathname: string, query: { [key: string]: any }) {
		router.push({
			pathname,
			query
		});
	}

	const isDraft = noteId === null;

	return (
		<div className="note-editor">
			<form className="note-editor-form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
				<label className="offscreen" htmlFor="note-title-input">
					Enter a title for your note
				</label>
				<input
					id="note-title-input"
					type="text"
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				<label className="offscreen" htmlFor="note-body-input">
					Enter the body for your note
				</label>
				<textarea
					id="note-body-input"
					value={body}
					onChange={(e) => {
						setBody(e.target.value);
					}}
				/>
			</form>
			<div className="note-editor-preview">
				<div className="note-editor-menu" role="menubar">
					<button
						className="note-editor-done"
						disabled={isSaving}
						onClick={() => handleSave({ title, body })}
						role="menuitem"
					>
						<img src="/checkmark.svg" width="14px" height="10px" alt="" role="presentation" />
						Done
					</button>
					{!isDraft && (
						<button
							className="note-editor-delete"
							disabled={isDeleting}
							onClick={() => handleDelete()}
							role="menuitem"
						>
							<img src="/cross.svg" width="10px" height="10px" alt="" role="presentation" />
							Delete
						</button>
					)}
				</div>
				<div className="label label--preview" role="status">
					Preview
				</div>
				<h1 className="note-title">{title}</h1>
				<NotePreview body={body} />
			</div>
		</div>
	);
}
