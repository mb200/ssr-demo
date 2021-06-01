import { useHistory } from 'react-router';

type Props = {
	noteId: number | null;
};

const EditButton: React.FC<Props> = ({ noteId, children }) => {
	const history = useHistory();
	const isDraft = noteId == null;
	const pathname = isDraft ? '/' : `/notes/${noteId}`;

	return (
		<button
			className={['edit-button', isDraft ? 'edit-button--solid' : 'edit-button--outline'].join(' ')}
			role="menuitem"
			onClick={() => {
				history.push({ pathname, search: new URLSearchParams({ isEditing: 'true' }).toString() });
			}}
		>
			{children}
		</button>
	);
};

export default EditButton;
