'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

export type MultiSuggestOption = Readonly<{
	value: string;
	label: string;
}>;

export interface MultiSuggestInputProps {
	name: string;
	label?: string;
	placeholder?: string;
	defaultValue?: readonly string[];
	options: readonly MultiSuggestOption[];
	allowCreate?: boolean;
}

export const MultiSuggestInput = (props: MultiSuggestInputProps) => {
	const {
		name,
		label,
		placeholder,
		defaultValue = [],
		options,
		allowCreate = false,
		...inputProps
	} = props;

	const containerRef = useRef<HTMLDivElement | null>(null);

	// State
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<readonly string[]>(defaultValue);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [usedArrowNav, setUsedArrowNav] = useState<boolean>(false);

	// Keep selection in sync with defaultValue changes
	useEffect(() => setSelected(defaultValue), [defaultValue]);

	// Lookup map for labels by value
	const labelByValue = useMemo(() => {
		const m = new Map<string, string>();
		for (const o of options) m.set(o.value, o.label);
		return m;
	}, [options]);

	const selectedSet = useMemo(
		() => new Set<string>(selected as string[]),
		[selected],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		const predicate = (opt: MultiSuggestOption) =>
			!selectedSet.has(opt.value) &&
			(q === '' || opt.label.toLowerCase().includes(q));
		return options.filter(predicate);
	}, [options, query, selectedSet]);

	// Keep active index in bounds when list changes
	useEffect(() => {
		if (filtered.length === 0) {
			setActiveIndex(0);
			return;
		}
		setActiveIndex(i => Math.min(Math.max(0, i), filtered.length - 1));
	}, [filtered]);

	// Selection helpers
	const addValue = useCallback(
		(value: string) => {
			if (!value || selected.includes(value)) return;
			setSelected([...selected, value]);
			setQuery('');
			setOpen(true);
		},
		[selected],
	);

	const selectOption = useCallback(
		(opt: MultiSuggestOption) => {
			addValue(opt.value);
		},
		[addValue],
	);

	// Input handlers
	const onInputChange = useCallback((value: string) => {
		setQuery(value);
		setOpen(true);
		// Reset navigation state when the user continues typing
		setUsedArrowNav(false);
	}, []);

	const onInputFocus = useCallback(() => setOpen(true), []);

	const onInputKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'ArrowDown' || e.key === 'Tab') {
				e.preventDefault();
				setOpen(true);
				setActiveIndex(i => {
					if (filtered.length === 0) return 0;
					const last = Math.max(0, filtered.length - 1);
					// If user hasn't used arrows yet (i is 0 by default after typing reset), jump to first option
					// Otherwise, move down normally
					return usedArrowNav ? Math.min(i + 1, last) : 0;
				});
				setUsedArrowNav(true);
				return;
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				setActiveIndex(i => {
					if (filtered.length === 0) return 0;
					return usedArrowNav ? Math.max(i - 1, 0) : 0;
				});
				setUsedArrowNav(true);
				return;
			}
			if (e.key === 'Enter') {
				e.preventDefault();
				const q = query.trim();
				if (allowCreate) {
					if (filtered.length > 0 && usedArrowNav) {
						const pick = filtered[Math.min(activeIndex, filtered.length - 1)];
						if (pick) selectOption(pick);
					} else if (q.length > 0) addValue(q);
				} else {
					if (filtered.length > 0) {
						const pick = filtered[Math.min(activeIndex, filtered.length - 1)];
						if (pick) selectOption(pick);
					}
				}
				setUsedArrowNav(false);
				return;
			}
			if (e.key === 'Escape') {
				setOpen(false);
				return;
			}
		},
		[
			activeIndex,
			addValue,
			allowCreate,
			filtered,
			query,
			selectOption,
			usedArrowNav,
		],
	);

	// outside click close
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (!containerRef.current) return;
			if (!containerRef.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', onClick);
		return () => document.removeEventListener('mousedown', onClick);
	}, [setOpen]);

	return (
		<label className="block">
			{label}
			<div className="mt-1" ref={containerRef}>
				<div className="flex flex-wrap gap-2">
					{selected.map(v => (
						<span
							key={String(v)}
							className="mt-1 mb-1 flex items-center gap-2 rounded bg-gray-200 text-gray-700 text-sm font-semibold px-3 py-1"
						>
							<input type="hidden" name={name} value={String(v)} />
							{labelByValue.get(String(v)) ?? String(v)}

							<button
								type="button"
								aria-label="Remove item"
								onClick={() => setSelected(selected.filter(x => x !== v))}
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
						onChange={e => onInputChange(e.target.value)}
						onFocus={onInputFocus}
						onKeyDown={onInputKeyDown}
						{...inputProps}
					/>
					{open && filtered.length > 0 && (
						<ul
							className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-white shadow"
							role="listbox"
						>
							{filtered.map((opt, idx) => {
								const isActive =
									(!allowCreate || usedArrowNav) && idx === activeIndex;
								return (
									<li key={opt.value}>
										<button
											type="button"
											role="option"
											aria-selected={isActive}
											className={`w-full text-left px-2 py-1 text-sm leading-tight hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}
											onMouseEnter={() => setActiveIndex(idx)}
											onClick={() => selectOption(opt)}
										>
											{opt.label}
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</div>
		</label>
	);
};

export default MultiSuggestInput;
