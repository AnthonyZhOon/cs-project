import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';

export default async function NewTaskPage({
	params,
}: {
	params: Promise<{workspaceId: string}>;
}) {
	const {workspaceId} = await params;
	const [availableTags, members, dependencies] = await Promise.all([
		api.getTags(workspaceId),
		api.getAvailableMembers(workspaceId),
		api.getAvailableTaskDependencies(workspaceId),
	]);

	return (
		<TaskForm
			availableTags={availableTags}
			availableMembers={members}
			availableDependencies={dependencies}
			workspaceId={workspaceId}
		/>
	);
}
