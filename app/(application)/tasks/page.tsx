import Link from 'next/link';
import FiltersBar from '@/components/FiltersBar';
import TaskComponent from '@/components/Task';
import api from '@/lib/api';
import {priorityFromString} from '@/lib/types';
import {getWorkspaceId} from '@/lib/util';
import type {Priority} from '@/lib/types';

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

	const priorityOptions: string[] = ['High', 'Medium', 'Low'];

	return (
		<div className="p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Tasks</h1>
				<Link href="/tasks/new">
					<button className="bg-white hover:bg-gray-50 text-black border border-black px-4 py-2 rounded-lg font-medium transition-colors">
						New Task
					</button>
				</Link>
			</div>
			<FiltersBar
				filters={[
					{
						name: 'priority',
						label: 'Priority',
						value: selectedPriority ?? '',
						options: priorityOptions,
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
