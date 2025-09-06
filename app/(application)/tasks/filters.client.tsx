'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import Select from '@/components/inputs/Select';

export default function FiltersBar({
	selectedPriority = '',
	selectedTag = '',
	selectedAssignee = '',
	priorityOptions,
	tagOptions,
	assigneeOptions,
}: {
	selectedPriority?: string;
	selectedTag?: string;
	selectedAssignee?: string;
	priorityOptions: readonly string[];
	tagOptions: string[];
	assigneeOptions: string[];
}) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const updateParam = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) params.set(key, value);
		else params.delete(key);
		router.replace(`?${params.toString()}`, {scroll: false});
	};

	return (
		<div className="flex flex-wrap gap-4 items-end">
			<div className="w-48">
				<Select
					name="priority"
					label="Priority"
					value={selectedPriority}
					onChange={e => updateParam('priority', e.currentTarget.value)}
				>
					{priorityOptions.map(value => (
						<option key={value} value={value}>
							{value ? value.charAt(0) + value.slice(1).toLowerCase() : 'All'}
						</option>
					))}
				</Select>
			</div>
			<div className="w-56">
				<Select
					name="tag"
					label="Tag"
					value={selectedTag}
					onChange={e => updateParam('tag', e.currentTarget.value)}
				>
					<option value="">All</option>
					{tagOptions.map(value => (
						<option key={value} value={value}>
							{value}
						</option>
					))}
				</Select>
			</div>
			<div className="w-56">
				<Select
					name="assignee"
					label="Assignee"
					value={selectedAssignee}
					onChange={e => updateParam('assignee', e.currentTarget.value)}
				>
					<option value="">All</option>
					{assigneeOptions.map(value => (
						<option key={value} value={value}>
							{value}
						</option>
					))}
				</Select>
			</div>
		</div>
	);
}
