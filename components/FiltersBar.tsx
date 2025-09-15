'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import Select from '@/components/inputs/Select';

export interface FilterSpec {
	name: string;
	label: string;
	value?: string;
	options: string[];
}

// TODO: Fix this garbage

export default function FiltersBar({
	filters,
	className = '',
}: {
	filters: FilterSpec[];
	/** keys to clear when pressing "Clear filters"; defaults to all filter names */
	className?: string;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const updateParam = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) params.set(key, value);
		else params.delete(key);
		router.replace(`?${params.toString()}`, {scroll: false});
	};

	const clearFilters = () => {
		const params = new URLSearchParams(searchParams.toString());
		filters.map(f => f.name).forEach(k => params.delete(k));
		const q = params.toString();
		router.replace(q ? `?${q}` : '?', {scroll: false});
	};

	const anyActive = filters.some(f => (f.value ?? '').length > 0);

	return (
		<div className={`flex flex-wrap gap-4 items-end ${className}`}>
			{filters.map(f => (
				<div key={f.name} className="w-48">
					<Select
						name={f.name}
						label={f.label}
						value={f.value ?? ''}
						onChange={e => updateParam(f.name, e.currentTarget.value)}
					>
						<option value="">All</option>
						{f.options.map(o => (
							<option key={o} value={o}>
								{o}
							</option>
						))}
					</Select>
				</div>
			))}
			<div className="shrink-0">
				<button
					type="button"
					onClick={clearFilters}
					disabled={!anyActive}
					className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
					aria-label="Clear filters"
				>
					Clear filters
				</button>
			</div>
		</div>
	);
}
