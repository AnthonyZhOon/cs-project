import UpcomingBox from '@/components/UpcomingBox';
import TaskSummary from '@/components/TaskSummary';
import ComponentBox from '@/components/ComponentBox';
import Calendar from '@/components/Calendar';

const exampleTasks = [
	{name: 'Task 1', date: new Date(), url: '#', complete: true},
	{
		name: 'Task 2',
		date: new Date(Date.now() + 86400000),
		url: '#',
		complete: false,
	},
	{
		name: 'Task 3',
		date: new Date(Date.now() + 2 * 86400000),
		url: '#',
		complete: false,
	},
];

const exampleEvents = [
	{name: 'Event A', date: new Date(), url: '#'},
	{name: 'Event B', date: new Date(Date.now() + 3 * 86400000), url: '#'},
	{name: 'Event C', date: new Date(Date.now() + 5 * 86400000), url: '#'},
];

export default function DashboardPage() {
	return (
		<div className="grid grid-cols-12 gap-4 p-6">
			<section className="col-span-12 lg:col-span-5 space-y-4">
				<UpcomingBox itemType="Task" items={exampleTasks} />
				<TaskSummary />
			</section>

			<section className="col-span-12 lg:col-span-5 space-y-4">
				<UpcomingBox itemType="Event" items={exampleEvents} />
				<Calendar></Calendar>
			</section>

			<section className="col-span-12 lg:col-span-2 space-y-4">
				<ComponentBox title="Reminders">
					<div className="min-h-[520px] leading-6 text-sm text-gray-700 space-y-2">
						<p>• Submit report by Friday</p>
						<p>• Group meeting: Thu 3:00 pm</p>
						<p>• Follow up with Lauren about APIs</p>
						<p>• Prepare demo data for dashboard</p>
						<p className="text-gray-400">…more coming soon</p>
					</div>
				</ComponentBox>
			</section>
		</div>
	);
}
