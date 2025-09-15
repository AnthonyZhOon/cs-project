import Tags from '@/components/Tags';
import type {ReactNode} from 'react';

export const InfoRow = ({
	label,
	text,
	className = '',
}: {
	label: string;
	text: string | ReactNode;
	className?: string;
}) => (
	<div className="flex justify-between items-center mb-1">
		<span className="text-sm text-gray-600">{label}</span>
		{typeof text === 'string' ? (
			<span className={`text-sm font-medium ${className}`}>{text}</span>
		) : (
			<div>{text}</div>
		)}
	</div>
);

export const TagsRow = ({
	tags,
	className = '',
}: {
	tags: string[];
	className?: string;
}) => {
	if (tags.length === 0) return null;
	return <InfoRow label="Tags" text={Tags(tags)} className={className} />;
};

export default InfoRow;
