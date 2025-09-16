import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';

export default async function NewTaskPage({
	params,
}: {
	params: Promise<{workspaceId: string}>;
}) {
	const {workspaceId} = await params;
	const [availableTags, members] = await Promise.all([
		api.getTags(workspaceId),
		api.getWorkspaceMembers(workspaceId),
	]);

	return (
		<TaskForm
			availableTags={availableTags}
			members={members}
			workspaceId={workspaceId}
		/>
	);
}
