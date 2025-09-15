import {redirect} from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';
import {getWorkspaceId} from '@/lib/util';

interface EditTaskPageProps {
	params: {
		id: string;
	};
}

export default async function EditTaskPage({params}: EditTaskPageProps) {
	const [task, availableTags] = await Promise.all([
		api.getTaskWithAssigneesAndTags(params.id),
		api.getTags(await getWorkspaceId()),
	]);

	if (!task) redirect('/tasks');

	return <TaskForm task={task} availableTags={availableTags} />;
}
