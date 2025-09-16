import {redirect} from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';

export default async function EditTaskPage({
	params,
}: {
	params: Promise<{id: string; workspaceId: string}>;
}) {
	const {id, workspaceId} = await params;
	const [task, availableTags, ws] = await Promise.all([
		api.getTaskWithAssigneesAndTags(id),
		api.getTags(workspaceId),
		api.getWorkspaceMembers(workspaceId),
	]);

	if (!task) redirect('/tasks');

	const members =
		ws?.members.map(m => ({id: m.user.id, name: m.user.name})) ?? [];
	return (
		<TaskForm
			task={task}
			availableTags={availableTags}
			members={members}
			workspaceId={workspaceId}
		/>
	);
}
