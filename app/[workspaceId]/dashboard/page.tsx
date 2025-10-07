import Calendar from '@/components/Calendar';
import MissingAuthError from '@/components/MissingAuthError';
import TaskSummary from '@/components/TaskSummary';
import UpcomingEventBox from '@/components/UpcomingEventBox';
import UpcomingTaskBox from '@/components/UpcomingTaskBox';
import api from '@/lib/api';
import {auth0} from '@/lib/auth0';

export default async function DashboardPage({
	params,
}: {
	params: Promise<{workspaceId: string}>;
}) {
	const {workspaceId} = await params;
	const session = await auth0.getSession();
	if (session === null) return <MissingAuthError />;

	const userId = session.user.sub;
	const tasks = await api.getTasks({workspaceId, assigneeId: userId});
	const events = await api.getEvents({workspaceId, attendeeId: userId});
	const taskDates = tasks
		.filter(t => t.deadline != null)
		.map(t => new Date(t.deadline!));

	const eventDates = events.flatMap(e => {
		const start = new Date(e.start);
		const end = new Date(e.end);

		const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
		const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

		const days: Date[] = [];
		let current = new Date(startDay);

		while (current <= endDay) {
			days.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}

		return days;
	});

	return (
		<div className="grid grid-cols-12 gap-4 p-6">
			<section className="col-span-12 lg:col-span-6 space-y-4">
				<UpcomingTaskBox tasks={tasks} />
				<TaskSummary tasks={tasks} />
			</section>

			<section className="col-span-12 lg:col-span-6 space-y-4">
				<UpcomingEventBox events={events} />
				<Calendar
					taskDates={taskDates}
					eventDates={eventDates}
				/>
			</section>
		</div>
	);
}
