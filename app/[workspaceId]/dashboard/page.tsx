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
	return (
		<div className="grid grid-cols-12 gap-4 p-6">
			<section className="col-span-12 lg:col-span-6 space-y-4">
				<UpcomingTaskBox tasks={tasks} />
				<TaskSummary tasks={tasks} />
			</section>

			<section className="col-span-12 lg:col-span-6 space-y-4">
				<UpcomingEventBox events={events} />
				<Calendar />
			</section>
		</div>
	);
}
