'use client';

import {useEffect, useMemo, useRef, useState} from 'react';

interface Option {
	id: string;
	name: string;
}

export default function MembersInput({
	name,
	options,
	label = 'Members',
	placeholder = 'Search members…',
	defaultValue = [],
	...props
}: React.ComponentPropsWithRef<'input'> & {
	label?: string;
	options: Option[];
	defaultValue?: string[]; // array of user IDs
}) {
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<readonly string[]>(defaultValue);
	const [activeIndex, setActiveIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setSelected(defaultValue);
	}, [defaultValue]);

	const byId = useMemo(() => {
		const m = new Map<string, Option>();
		for (const o of options) m.set(o.id, o);
		return m;
	}, [options]);

	const filtered = useMemo((): Option[] => {
		const q = query.trim().toLowerCase();
		return options.filter(
			o =>
				!selected.includes(o.id) &&
				(q === '' || o.name.toLowerCase().includes(q)),
		);
	}, [options, query, selected]);

	// keep active index in bounds when list changes
	useEffect(() => {
		if (filtered.length === 0) {
			setActiveIndex(0);
			return;
		}
		setActiveIndex(i => Math.min(i, filtered.length - 1));
	}, [filtered]);

	// basic outside click close
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (!containerRef.current) return;
			if (!containerRef.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, []);

	return (
		<label className="block">
			{label}
			<div className="mt-1" ref={containerRef}>
				<div className="flex flex-wrap gap-2">
					{selected.map(id => (
						<span
							key={id}
							className="mt-1 mb-1 flex items-center gap-2 rounded bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1"
						>
							<input type="hidden" name={name} value={id} />
							{byId.get(id)?.name ?? id}
							<button
								type="button"
								aria-label="Remove member"
								onClick={() => setSelected(selected.filter(x => x !== id))}
								className="text-gray-500 hover:text-gray-700"
							>
								&times;
							</button>
						</span>
					))}
				</div>
				<div className="relative">
					<input
						type="text"
						className="w-full border p-2 rounded"
						placeholder={placeholder}
						value={query}
						onChange={e => {
							setQuery(e.target.value);
							setOpen(true);
						}}
						onFocus={() => setOpen(true)}
						onKeyDown={e => {
							if (e.key === 'ArrowDown') {
								e.preventDefault();
								setOpen(true);
								setActiveIndex(i =>
									Math.min(i + 1, Math.max(0, filtered.length - 1)),
								);
								return;
							}
							if (e.key === 'ArrowUp') {
								e.preventDefault();
								setActiveIndex(i => Math.max(i - 1, 0));
								return;
							}
							if (e.key === 'Enter') {
								e.preventDefault();
								if (filtered.length > 0) {
									const pick =
										filtered[Math.min(activeIndex, filtered.length - 1)];
									if (pick) {
										setSelected([...selected, pick.id]);
										setQuery('');
										// Keep open so Enter can add the next member quickly
										setOpen(true);
									}
								}
								return;
							}
							if (e.key === 'Escape') {
								setOpen(false);
								return;
							}
						}}
						{...props}
					/>
					{open && filtered.length > 0 && (
						<ul
							className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-white shadow"
							role="listbox"
						>
							{filtered.map((opt, idx) => (
								<li key={opt.id}>
									<button
										type="button"
										role="option"
										aria-selected={idx === activeIndex}
										className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${idx === activeIndex ? 'bg-gray-100' : ''}`}
										onMouseEnter={() => setActiveIndex(idx)}
										onClick={() => {
											setSelected([...selected, opt.id]);
											setQuery('');
											setOpen(false);
										}}
									>
										{opt.name}
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</label>
	);
}
