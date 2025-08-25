export default function Input({
	label,
	...props
}: React.ComponentPropsWithRef<'input'> & {label: string}) {
	return (
		<label>
			{label}
			<input className="w-full border p-2 rounded" {...props} />
		</label>
	);
}
