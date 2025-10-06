import EventForm from '@/components/EventForm';
import api from '@/lib/api';

export default async function NewEventPage({
	params,
}: {
	params: Promise<{workspaceId: string}>;
}) {
	const {workspaceId} = await params;

	const [availableTags, members] = await Promise.all([
		api.getTags(workspaceId),
		api.getAvailableMembers(workspaceId),
	]);

	return (
		<EventForm
			availableTags={availableTags}
			availableMembers={members}
			workspaceId={workspaceId}
		/>
	);
}
