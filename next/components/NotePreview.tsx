import TextWithMarkdown from './TextWithMarkdown';

type Props = {
	body: string;
};

export default function NotePreview({ body }: Props) {
	return (
		<div className="note-preview">
			<TextWithMarkdown text={body} />
		</div>
	);
}
