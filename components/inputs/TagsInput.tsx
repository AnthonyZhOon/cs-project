'use client';

import {useId, useState} from 'react';

export default function TagsInput({
	name,
	options,
	label = 'Tags',
	placeholder = 'Add a tag',
	...props
}: React.ComponentPropsWithRef<'input'> & {
	label?: string;
	options: string[];
}) {
	const id = useId();
	const [selected, setSelected] = useState<readonly string[]>([]);
	return (
		<label>
			{label}
			<div className="flex gap-2">
				{selected.map(item => (
					<span
						key={item}
						className="mt-2 mb-2 flex gap-2 rounded bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1"
					>
						<input type="hidden" name={name} value={item} />
						{item}
						<button
							type="button"
							onClick={() => setSelected(selected.filter(t => t !== item))}
							className="text-gray-500 hover:text-gray-700"
						>
							&times;
						</button>
					</span>
				))}
			</div>
			<input
				type="text"
				list={id}
				className="w-full border p-2 rounded"
				placeholder={placeholder}
				onKeyDown={e => {
					if (e.key === 'Enter' && e.currentTarget.value) {
						e.preventDefault();
						setSelected([...selected, e.currentTarget.value]);
						e.currentTarget.value = '';
					}
				}}
				{...props}
			/>
			<datalist id={id}>
				{options
					.filter(option => !selected.includes(option))
					.map(option => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
			</datalist>
		</label>
	);
}
