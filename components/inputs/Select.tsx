export default function Input({
	label,
	...props
}: React.ComponentPropsWithRef<'select'> & {label: string}) {
	return (
		<label>
			{label}
			<select className="w-full border p-2 rounded" {...props}>
				{props.children}
			</select>
		</label>
	);
}
