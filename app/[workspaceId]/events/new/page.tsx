import EventForm from '@/components/EventForm';
import api from '@/lib/api';

export default async function NewEventPage({
	params,
}: {
	params: Promise<{workspaceId: string}>;
}) {
	const {workspaceId} = await params;

	const [availableTags, ws] = await Promise.all([
		api.getTags(workspaceId),
		api.getWorkspaceMembers(workspaceId),
	]);
	const members = ws.members.map(m => ({id: m.user.id, name: m.user.name}));

	return (
		<EventForm
			availableTags={availableTags}
			members={members}
			workspaceId={workspaceId}
		/>
	);
}
