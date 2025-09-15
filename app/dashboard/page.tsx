import UpcomingBox from '@/components/UpcomingBox';
import TaskSummary from '@/components/TaskSummary';
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
			<section className="col-span-12 lg:col-span-6 space-y-4">
				<UpcomingBox itemType="Task" items={exampleTasks} />
				<TaskSummary />
			</section>

			<section className="col-span-12 lg:col-span-6 space-y-4">
				<UpcomingBox itemType="Event" items={exampleEvents} />
				<Calendar />
			</section>
		</div>
	);
}
