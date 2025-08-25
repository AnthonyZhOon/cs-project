'use client';

type FieldType = 'text' | 'textarea' | 'select' | 'date';

interface FieldConfig {
	name: string;
	label: string;
	placeholder?: string;
	type: FieldType;
	options?: string[];
}

interface CreateFormProps {
	title: string;
	fields: FieldConfig[];
	submitText?: string;
}

export default function CreateForm({
	title,
	fields,
	submitText = 'Create',
}: CreateFormProps) {
	return (
		<div className="border border-black rounded-md p-4 space-y-4">
			<h2 className="text-xl font-bold mb-4">{title}</h2>

			{fields.map(field => (
				<div key={field.name}>
					<div className="block font-bold mb-1">{field.label}</div>

					{field.type === 'text' && (
						<input
							type="text"
							placeholder={field.placeholder}
							className="w-full border p-2 rounded"
						/>
					)}

					{field.type === 'textarea' && (
						<textarea
							placeholder={field.placeholder}
							className="w-full border p-2 rounded min-h-[100px]"
						/>
					)}

					{field.type === 'select' && (
						<select className="w-full border p-2 rounded">
							{field.options?.map(opt => (
								<option key={opt}>{opt}</option>
							))}
						</select>
					)}

					{field.type === 'date' && (
						<input type="date" className="w-full border p-2 rounded" />
					)}
				</div>
			))}

			{/* button */}
			<div className="flex justify-end gap-2 mt-4">
				<button className="border px-4 py-2 rounded">Cancel</button>
				<button className="bg-black text-white px-4 py-2 rounded">
					{submitText}
				</button>
			</div>
		</div>
	);
}
