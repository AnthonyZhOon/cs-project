import {redirect} from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';

export default async function EditTaskPage({
	params,
}: {
	params: Promise<{id: string; workspaceId: string}>;
}) {
	const {id, workspaceId} = await params;
	const [task, availableTags, members, dependencies] = await Promise.all([
		api.getTask(id),
		api.getTags(workspaceId),
		api.getAvailableMembers(workspaceId),
		api.getAvailableTaskDependencies(workspaceId),
	]);

	if (!task) redirect('/tasks');

	return (
		<TaskForm
			task={task}
			availableTags={availableTags}
			availableMembers={members}
			availableDependencies={dependencies.filter(t => t.id !== task.id)}
			workspaceId={workspaceId}
		/>
	);
}
