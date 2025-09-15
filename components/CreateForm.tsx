import Form from 'next/form';
import Link from 'next/link';

export default function CreateForm({
	formTitle,
	submitText = 'Create',
	children,
	deleteAction,
	...props
}: React.ComponentPropsWithRef<typeof Form> & {
	formTitle: string;
	submitText?: string;
	deleteAction?: (() => Promise<void>) | undefined;
}) {
	return (
		<div className="border border-black rounded-md p-4 space-y-4">
			<h2 className="text-xl font-bold mb-4">{formTitle}</h2>

			<Form className="flex flex-col gap-2" {...props}>
				{children}

				{/* This delete button is a little stupid but. */}
				<div className="flex justify-between items-center mt-4">
					{deleteAction && (
						<button
							type="submit"
							formAction={deleteAction}
							className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
						>
							Delete
						</button>
					)}
					<div className="flex gap-2">
						<Link href="/tasks">
							<button type="button" className="border px-4 py-2 rounded">
								Cancel
							</button>
						</Link>
						<button className="bg-black text-white px-4 py-2 rounded">
							{submitText}
						</button>
					</div>
				</div>
			</Form>
		</div>
	);
}
