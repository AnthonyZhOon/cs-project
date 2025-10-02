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

	const [availableTags, members] = await Promise.all([
		api.getTags(event.workspaceId),
		api.getAvailableMembers(event.workspaceId),
	]);

	return (
		<EventForm
			event={event}
			availableTags={availableTags}
			availableMembers={members}
			workspaceId={workspaceId}
		/>
	);
}
