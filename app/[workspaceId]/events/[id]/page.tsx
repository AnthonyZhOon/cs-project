import {redirect} from 'next/navigation';
import EventForm from '@/components/EventForm';
import api from '@/lib/api';

export default async function EditEventPage({
	params,
}: {
	params: Promise<{id: string; workspaceId: string}>;
}) {
	const {id, workspaceId} = await params;

	const event = await api.getEventWithAttendeesAndTags(id);
	if (!event) redirect('/events');

	const [availableTags, ws] = await Promise.all([
		api.getTags(event.workspaceId),
		api.getWorkspaceMembers(event.workspaceId),
	]);
	const members =
		ws?.members.map(m => ({id: m.user.id, name: m.user.name})) ?? [];

	return (
		<EventForm
			event={event}
			availableTags={availableTags}
			members={members}
			workspaceId={workspaceId}
		/>
	);
}
