'use client';


type FieldProps = {
	name: string;
	label: string;
} & (
	| {
			type: 'text' | 'textarea';
			placeholder: string;
	  }
	| {
			type: 'select';
			options: string[];
	  }
	| {
			type: 'date';
	  }
);

const Field = (field: FieldProps) => {
	switch (field.type) {
		case 'text':
			return (
				<input
					type="text"
					placeholder={field.placeholder}
					className="w-full border p-2 rounded"
				/>
			);

		case 'textarea':
			return (
				<textarea
					placeholder={field.placeholder}
					className="w-full border p-2 rounded min-h-[100px]"
				/>
			);

		case 'select':
			return (
				<select className="w-full border p-2 rounded">
					{field.options.map(opt => (
						<option key={opt}>{opt}</option>
					))}
				</select>
			);

		case 'date':
			return <input type="date" className="w-full border p-2 rounded" />;
	}
};

interface CreateFormProps {
	title: string;
	fields: FieldProps[];
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
					<Field {...field} />
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
