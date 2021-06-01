import { useRouter } from 'next/router';

type Props = {
	noteId: number | null;
};

const EditButton: React.FC<Props> = ({ noteId, children }) => {
	const router = useRouter();
	const isDraft = noteId == null;
	const pathname = isDraft ? '/' : `/notes/${router.query.id}`;

	return (
		<button
			className={['edit-button', isDraft ? 'edit-button--solid' : 'edit-button--outline'].join(' ')}
			role="menuitem"
			onClick={() => {
				router.push({ pathname, query: { isEditing: true } });
			}}
		>
			{children}
		</button>
	);
};

export default EditButton;
