import UpcomingBox from '@/components/UpcomingBox';
import TaskSummary from '@/components/TaskSummary';
import ComponentBox from '@/components/ComponentBox';
import Calendar from '@/components/Calendar';

const exampleTasks = [
	{ name: 'Task 1', date: new Date(), url: '#', complete: true },
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
	{ name: 'Event A', date: new Date(), url: '#' },
	{ name: 'Event B', date: new Date(Date.now() + 3 * 86400000), url: '#' },
	{ name: 'Event C', date: new Date(Date.now() + 5 * 86400000), url: '#' },
];

export default function DashboardPage() {
	return (
		<div className="grid grid-cols-12 gap-6 p-6 bg-pink-50 min-h-screen">
			<section className="col-span-12 lg:col-span-5 space-y-4">
				<div className="rounded-2xl bg-white/70 border border-pink-100 shadow-sm p-4">
					<UpcomingBox itemType="Task" items={exampleTasks} />
				</div>
				<div className="rounded-2xl bg-white/70 border border-pink-100 shadow-sm p-4">
					<TaskSummary />
				</div>
			</section>

			<section className="col-span-12 lg:col-span-5 space-y-4">
				<div className="rounded-2xl bg-white/70 border border-blue-100 shadow-sm p-4">
					<UpcomingBox itemType="Event" items={exampleEvents} />
				</div>
				<div className="rounded-2xl bg-white/70 border border-blue-100 shadow-sm p-4">
					<Calendar />
				</div>
			</section>

			<section className="col-span-12 lg:col-span-2 space-y-4">
				<ComponentBox title="Reminders">
					<div className="min-h-[520px] leading-6 text-sm text-gray-700 space-y-2">
						<p className="bg-yellow-50 px-2 py-1 rounded-md">• Submit report by Friday</p>
						<p className="bg-green-50 px-2 py-1 rounded-md">• Group meeting: Thu 3:00 pm</p>
						<p className="bg-pink-50 px-2 py-1 rounded-md">• Follow up with Lauren about APIs</p>
						<p className="bg-blue-50 px-2 py-1 rounded-md">• Prepare demo data for dashboard</p>
						<p className="text-gray-400 italic">…more coming soon</p>
					</div>
				</ComponentBox>
			</section>
		</div>
	);
}
