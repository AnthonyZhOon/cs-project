'use client';

import Link from 'next/link';
import {useState, type PropsWithChildren} from 'react';
import TaskComponent from '@/components/Task';
import {comparePriorities} from '@/lib/types';
import type api from '@/lib/api';

type Task = Awaited<ReturnType<typeof api.getTasks>>[number];

const SortButton = ({
	onClick,
	ariaLabel,
	side,
	children,
}: PropsWithChildren<{
	onClick: () => void;
	ariaLabel: string;
	side: 'left' | 'right';
}>) => (
	<button
		type="button"
		aria-label={ariaLabel}
		onClick={onClick}
		className={`px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded-${side === 'left' ? 'l' : 'r'} border-y ${side === 'left' ? 'border-x' : 'border-r'}`}
	>
		{children}
	</button>
);

const SortButtons = ({
	property,
	sort,
}: {
	property: string;
	sort: (dir: 1 | -1) => void;
}) => (
	<div className="flex items-center gap-2">
		<span className="text-sm text-gray-600">{property}</span>
		<div className="inline-flex overflow-hidden">
			<SortButton
				side="left"
				ariaLabel={`Sort by ${property.toLowerCase()} ascending`}
				onClick={() => sort(1)}
			>
				↑
			</SortButton>
			<SortButton
				side="right"
				ariaLabel={`Sort by ${property.toLowerCase()} descending`}
				onClick={() => sort(-1)}
			>
				↓
			</SortButton>
		</div>
	</div>
);

const compareDeadlines = (a: Date | null, b: Date | null): number =>
	a ? (b ? a.getTime() - b.getTime() : -1) : b ? 1 : 0;

export default function SortableTaskList({tasks}: {tasks: readonly Task[]}) {
	const [sorted, setSorted] = useState(tasks);

	const sort = (compare: (x: Task, y: Task) => number) => (dir: 1 | -1) =>
		setSorted(sorted.toSorted((a, b) => dir * compare(a, b)));

	return (
		<div className="space-y-4">
			<div>
				<div>Sort</div>
				<div className="flex items-center gap-6">
					<SortButtons
						property="Deadline"
						sort={sort((a, b) => compareDeadlines(a.deadline, b.deadline))}
					/>
					<SortButtons
						property="Priority"
						sort={sort((a, b) => comparePriorities(a.priority, b.priority))}
					/>
				</div>
			</div>

			{sorted.length === 0 ? (
				<p className="text-sm text-gray-600">No tasks found.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{sorted.map(task => (
						<Link
							key={task.id}
							href={`/${task.workspaceId}/tasks/${task.id}`}
							className="block hover:opacity-80 transition-opacity"
						>
							<TaskComponent task={task} />
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
