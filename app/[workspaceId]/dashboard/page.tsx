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
		<div className="grid grid-cols-12 gap-6 p-6 min-h-screen">
			<section className="col-span-12 lg:col-span-5 space-y-4">
				<div className="rounded-2xl bg-white/70 border border-pink-100 shadow-sm p-4">
					<UpcomingTaskBox tasks={tasks} />
				</div>
				<div className="rounded-2xl bg-white/70 border border-pink-100 shadow-sm p-4">
					<TaskSummary tasks={tasks} />
				</div>
			</section>

			<section className="col-span-12 lg:col-span-6 space-y-4">
				<div className="rounded-2xl bg-white/70 border border-blue-100 shadow-sm p-4">
					<UpcomingEventBox events={events} />
				</div>
				<div className="rounded-2xl bg-white/70 border border-blue-100 shadow-sm p-4">
					<Calendar />
				</div>
			</section>
		</div>
	);
}
