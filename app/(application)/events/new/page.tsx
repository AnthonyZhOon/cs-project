import EventForm from '@/components/EventForm';
import api from '@/lib/api';
import {getWorkspaceId} from '@/lib/util';

export default async function NewEventPage() {
	const workspaceId = await getWorkspaceId();
	const [availableTags, ws] = await Promise.all([
		api.getTags(workspaceId),
		api.getWorkspaceMembers(workspaceId),
	]);
	const members =
		ws?.members.map(m => ({id: m.user.id, name: m.user.name})) ?? [];

	return <EventForm availableTags={availableTags} members={members} />;
}
