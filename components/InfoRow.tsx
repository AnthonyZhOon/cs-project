export const InfoRow = ({
	label,
	text,
	className = '',
}: {
	label: string;
	text: string;
	className?: string;
}) => (
	<div className="flex justify-between items-center mb-1">
		<span className="text-sm text-gray-600">{label}</span>
		<span className={`text-sm font-medium ${className}`}>{text}</span>
	</div>
);

export const PillRow = ({
	tags,
	label,
}: {
	tags: string[];
	label: string;
	className?: string;
}) => (
	<div className="flex justify-between items-center mb-1">
		<span className="text-sm text-gray-600">{label}</span>
		<div>
			{tags.map((tag, index) => (
				<span
					key={index}
					className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs mr-1"
				>
					{tag.trim()}
				</span>
			))}
		</div>
	</div>
);

export default InfoRow;
