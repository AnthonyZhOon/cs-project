export const Tags = (tags: string[]) =>
	tags.map((tag, index) => (
		<span
			key={index}
			className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs mr-1"
		>
			{tag.trim()}
		</span>
	));

export default Tags;
