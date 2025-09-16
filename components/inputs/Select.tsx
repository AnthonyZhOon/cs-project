export default function Input({
	label,
	...props
}: React.ComponentPropsWithRef<'select'> & {label: string}) {
	return (
		<label>
			{label}
			<select
				className="w-full border px-2 py-1.5 rounded text-sm leading-tight"
				{...props}
			>
				{props.children}
			</select>
		</label>
	);
}
