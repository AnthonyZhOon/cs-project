import {redirect} from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';

export default async function EditTaskPage({
	params,
}: {
	params: Promise<{id: string; workspaceId: string}>;
}) {
	const {id, workspaceId} = await params;
	const [task, availableTags, members] = await Promise.all([
		api.getTaskWithAssigneesAndTags(id),
		api.getTags(workspaceId),
		api.getWorkspaceMembers(workspaceId),
	]);

	if (!task) redirect('/tasks');

	return (
		<TaskForm
			task={task}
			availableTags={availableTags}
			members={members}
			workspaceId={workspaceId}
		/>
	);
}
