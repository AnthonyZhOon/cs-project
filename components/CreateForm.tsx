import Form from 'next/form';

export default function CreateForm({
	formTitle,
	submitText = 'Create',
	children,
	...props
}: React.ComponentPropsWithRef<typeof Form> & {
	formTitle: string;
	submitText?: string;
}) {
	return (
		<div className="border border-black rounded-md p-4 space-y-4">
			<h2 className="text-xl font-bold mb-4">{formTitle}</h2>

			<Form {...props}>
				{children}

				{/* button */}
				<div className="flex justify-end gap-2 mt-4">
					<button className="border px-4 py-2 rounded">Cancel</button>
					<button className="bg-black text-white px-4 py-2 rounded">
						{submitText}
					</button>
				</div>
			</Form>
		</div>
	);
}
