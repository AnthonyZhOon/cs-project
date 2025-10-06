import Link from 'next/link';
import FiltersBar from '@/components/FiltersBar';
import SortableTaskList from '@/components/SortableTaskList';
import api from '@/lib/api';
import {priorityFromString} from '@/lib/types';
import type {Priority} from '@/lib/types';

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
			assigneeId: assignee,
		}),
		api.getTags(workspaceId),
		api.getWorkspaceMembers(workspaceId),
	]);
	const priorityOptions = [
		{label: 'High', value: 'HIGH'},
		{label: 'Medium', value: 'MEDIUM'},
		{label: 'Low', value: 'LOW'},
	];

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
						options: assignees.map(({name, id}) => ({label: name, value: id})),
					},
				]}
			/>

			<SortableTaskList tasks={tasks} />
		</div>
	);
}
