import Link from 'next/link';
import EventComponent from '@/components/Event';
import FiltersBar from '@/components/FiltersBar';
import api from '@/lib/api';
import {getWorkspaceId} from '@/lib/util';

export default async function EventsPage({
	searchParams,
}: {
	searchParams: Promise<{tag?: string; attendee?: string}>;
}) {
	const params = await searchParams;

	// TODO: Get workspaces done.
	const selectedWorkspace = await getWorkspaceId();

	const [events, allTags, attendees] = await Promise.all([
		api.getEvents({
			workspaceId: selectedWorkspace,
			tag: params.tag,
			attendeeName: params.attendee,
		}),
		api.getTags(selectedWorkspace),
		(async () => {
			const ws = await api.getWorkspaceMembers(selectedWorkspace);
			return ws?.members.map(m => m.user.name) ?? [];
		})(),
	]);

	return (
		<div className="p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Events</h1>
				<Link href="/events/new">
					<button className="bg-white hover:bg-gray-50 text-black border border-black px-4 py-2 rounded-lg font-medium transition-colors">
						New Event
					</button>
				</Link>
			</div>
			<FiltersBar
				filters={[
					{
						name: 'tag',
						label: 'Tag',
						value: params.tag ?? '',
						options: allTags,
					},
					{
						name: 'attendee',
						label: 'Attendee',
						value: params.attendee ?? '',
						options: attendees,
					},
				]}
			/>

			{events.length === 0 ? (
				<p className="text-sm text-gray-600">No events found.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{events.map(event => (
						<Link
							key={event.id}
							href={`/events/${event.id}`}
							className="block hover:opacity-80 transition-opacity"
						>
							<EventComponent
								event={event}
								attendees={event.attendees}
								tags={event.tags}
							/>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
