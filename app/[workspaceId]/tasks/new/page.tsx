import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';

export default async function NewTaskPage({
	params,
}: {
	params: Promise<{workspaceId: string}>;
}) {
	const {workspaceId} = await params;
	const [availableTags, ws] = await Promise.all([
		api.getTags(workspaceId),
		api.getWorkspaceMembers(workspaceId),
	]);
	const members =
		ws?.members.map(m => ({id: m.user.id, name: m.user.name})) ?? [];

	return (
		<TaskForm
			availableTags={availableTags}
			members={members}
			workspaceId={workspaceId}
		/>
	);
}
