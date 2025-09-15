import TaskComponent, {exampleTask} from '@/components/Task';
import {Priority} from '@/lib/types';
import FiltersBar from './filters.client';
import type {TaskWithAssigneesAndTags} from '@/lib/types';

// Placeholder list used when no tasks are provided to the page
const placeholderTasks: NonNullable<TaskWithAssigneesAndTags>[] = Array.from({
	length: 6,
}).map(
	(_, i) =>
		({
			...exampleTask,
			id: `${i + 1}`,
			title: `${exampleTask.title} #${i + 1}`,
			// ensure a fresh Date instance per item
			deadline: exampleTask.deadline ? new Date(exampleTask.deadline) : null,
		}) as NonNullable<TaskWithAssigneesAndTags>,
);

// Page: accepts tasks if provided, otherwise shows example placeholders so the route renders standalone
export default async function TasksPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const params = await searchParams;
	// TODO: Query from database.
	const list = placeholderTasks;

	const selectedPriority =
		typeof params.priority === 'string' ? params.priority : '';
	const selectedTag = typeof params.tag === 'string' ? params.tag : '';
	const selectedAssignee =
		typeof params.assignee === 'string' ? params.assignee : '';

	const priorityOptions: readonly string[] = [
		'',
		Priority.LOW,
		Priority.MEDIUM,
		Priority.HIGH,
	];
	const tagOptions = [
		...new Set(list.flatMap(t => t.tags.map(tag => tag.name))),
	];
	const assigneeOptions = [
		...new Set(list.flatMap(t => t.assignees.map(a => a.name))),
	];

	const filtered = list.filter(t => {
		const byPriority = selectedPriority
			? t.priority === selectedPriority
			: true;
		const byTag = selectedTag
			? t.tags.some(tag => tag.name === selectedTag)
			: true;
		const byAssignee = selectedAssignee
			? t.assignees.some(a => a.name === selectedAssignee)
			: true;
		return byPriority && byTag && byAssignee;
	});

	return (
		<div className="p-4 space-y-4">
			<FiltersBar
				selectedPriority={selectedPriority}
				selectedTag={selectedTag}
				selectedAssignee={selectedAssignee}
				priorityOptions={priorityOptions}
				tagOptions={tagOptions}
				assigneeOptions={assigneeOptions}
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{filtered.map(task => (
					<TaskComponent key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}
