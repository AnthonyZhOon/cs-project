import Link from 'next/link';
import FiltersBar from '@/components/FiltersBar';
import TaskComponent from '@/components/Task';
import api from '@/lib/api';
import {priorityFromString} from '@/lib/types';
import type {Priority} from '@/lib/types';

// Page: accepts tasks if provided, otherwise shows example placeholders so the route renders standalone
export default async function TasksPage({
	searchParams,
	params,
}: {
	searchParams: Promise<{priority?: Priority; tag?: string; assignee?: string}>;
	params: Promise<{workspaceId: string}>;
}) {
	const {priority, tag, assignee} = await searchParams;
	const {workspaceId} = await params;
	const selectedPriority = priority ? priorityFromString(priority) : undefined;

	const [tasks, tags, assignees] = await Promise.all([
		api.getTasks({
			workspaceId,
			priority: selectedPriority,
			tag,
			assigneeName: assignee,
		}),
		api.getTags(workspaceId),
		(async () => {
			const ws = await api.getWorkspaceMembers(workspaceId);
			return ws?.members.map(m => m.user.name) ?? [];
		})(),
	]);

	const priorityOptions: string[] = ['High', 'Medium', 'Low'];

	return (
		<div className="p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Tasks</h1>
				<Link href={`/${workspaceId}/tasks/new`}>
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
						value: tag ?? '',
						options: tags,
					},
					{
						name: 'assignee',
						label: 'Assignee',
						value: assignee ?? '',
						options: assignees,
					},
				]}
			/>

			{tasks.length === 0 ? (
				<p className="text-sm text-gray-600">No tasks found.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{tasks.map(task => (
						<Link
							key={task.id}
							href={`/${workspaceId}/tasks/${task.id}`}
							className="block hover:opacity-80 transition-opacity"
						>
							<TaskComponent key={task.id} task={task} />
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
