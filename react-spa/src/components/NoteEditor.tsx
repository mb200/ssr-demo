import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { useHistory, useLocation } from 'react-router';
import { request } from '../utils/request';
import NotePreview from '../components/NotePreview';

type Props = {
	noteId: number | null;
	initialTitle?: string;
	initialBody?: string;
};

type EditArgs = Pick<Note, 'title' | 'body'>;

export default function NoteEditor({ noteId, initialTitle = '', initialBody = '' }: Props) {
	const history = useHistory();
	const { search } = useLocation();
	const queryClient = useQueryClient();
	const query = new URLSearchParams(search);

	const [title, setTitle] = useState(initialTitle);
	const [body, setBody] = useState(initialBody);

	const { mutateAsync: saveNote, isLoading: isSaving } = useMutation<Note, Error, EditArgs>(
		(args) => {
			const endpoint = noteId !== null ? `/notes/${noteId}` : `/notes`;
			const method = noteId !== null ? 'PUT' : 'POST';
			return request(endpoint, { method, body: JSON.stringify(args) });
		}
	);

	const { mutateAsync: deleteNote, isLoading: isDeleting } = useMutation<Note, Error>(() =>
		request(`/notes/${noteId}`, {
			method: 'DELETE'
		})
	);

	async function handleSave(payload: { title: string; body: string }) {
		const newNote = await saveNote(payload);
		const id = newNote.id || noteId;

		await queryClient.invalidateQueries(['notes']);
		await queryClient.invalidateQueries(['note']);
		navigate(`/notes/${id}`, { isEditing: false });
	}

	async function handleDelete() {
		await deleteNote();
		await queryClient.invalidateQueries(['notes']);
		const searchText = query.get('searchText') || '';
		navigate('/', { searchText });
	}

	function navigate(pathname: string, newQuery: { [key: string]: any }) {
		history.push({
			pathname,
			search: new URLSearchParams(newQuery).toString()
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
