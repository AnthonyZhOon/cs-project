import FiltersBar from '@/components/FiltersBar';
import TaskComponent from '@/components/Task';
import api from '@/lib/api';
import {Priority, priorityFromString} from '@/lib/types';
import {getWorkspaceId} from '@/lib/util';

// Page: accepts tasks if provided, otherwise shows example placeholders so the route renders standalone
export default async function TasksPage({
	searchParams,
}: {
	searchParams: Promise<{priority?: Priority; tag?: string; assignee?: string}>;
}) {
	const params = await searchParams;
	const selectedPriority = params.priority
		? priorityFromString(params.priority)
		: undefined;
	// Extract filters from URL
	const selectedWorkspace = await getWorkspaceId();

	const [tasks, tags, assignees] = await Promise.all([
		api.getTasks({
			workspaceId: selectedWorkspace,
			priority: selectedPriority,
			tag: params.tag,
			assigneeName: params.assignee,
		}),
		api.getTags(selectedWorkspace),
		(async () => {
			const ws = await api.getWorkspaceMembers(selectedWorkspace);
			return ws?.members.map(m => m.user.name) ?? [];
		})(),
	]);

	const priorityOptions: readonly string[] = [
		'',
		Priority.LOW,
		Priority.MEDIUM,
		Priority.HIGH,
	];

	return (
		<div className="p-4 space-y-4">
			<FiltersBar
				filters={[
					{
						name: 'priority',
						label: 'Priority',
						value: selectedPriority ?? '',
						options: priorityOptions.map(v =>
							v ? {value: v, label: v.charAt(0) + v.slice(1).toLowerCase()} : v,
						),
					},
					{
						name: 'tag',
						label: 'Tag',
						value: params.tag ?? '',
						options: tags,
					},
					{
						name: 'assignee',
						label: 'Assignee',
						value: params.assignee ?? '',
						options: assignees,
					},
				]}
			/>

			{tasks.length === 0 ? (
				<p className="text-sm text-gray-600">No tasks found.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{tasks.map(task => (
						<TaskComponent key={task.id} task={task} />
					))}
				</div>
			)}
		</div>
	);
}
