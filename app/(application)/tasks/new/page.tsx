import TaskForm from '@/components/TaskForm';
import api from '@/lib/api';
import {getWorkspaceId} from '@/lib/util';

export default async function NewTaskPage() {
	const availableTags = await api.getTags(await getWorkspaceId());

	return <TaskForm availableTags={availableTags} />;
}
