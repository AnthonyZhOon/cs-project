export default function Input({
	label,
	...props
}: React.ComponentPropsWithRef<'textarea'> & {label: string}) {
	return (
		<label>
			{label}
			<textarea
				className="w-full border p-2 rounded min-h-[100px]"
				{...props}
			/>
		</label>
	);
}
