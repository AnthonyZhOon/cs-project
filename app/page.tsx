import Link from 'next/link';
import Calendar from '@/components/Calendar';
import ComponentBox from '@/components/ComponentBox';
import TaskSummaryChart from '@/components/TaskSummary';
import UpcomingTaskBox from '@/components/UpcomingTaskBox';
import {auth0} from '@/lib/auth0';
import prisma from '@/lib/prisma';
import {getWorkspaceId} from '@/lib/util';

const allUsers = async () => {
	const users = await prisma.user.findMany();
	return users;
};

const allTasks = async () => {
	const tasks = await prisma.task.findMany({
		include: {assignees: true, tags: true},
	});
	return tasks;
};

export default async function Blog() {
	const workspaceId = await getWorkspaceId();
	const users = await allUsers();
	const tasks = await allTasks();

	const session = await auth0.getSession();
	// TODO: Handle null session better, should be middleware protected
	if (session === null) return <div>Not logged in for some reason??</div>;
	// const feed = getFeed()
	return (
		<div className="p-2">
			<Link href={`/${workspaceId}/dashboard`}>TestWorkspace</Link>
			<div className="mb-4">
				<Link
					href="/tasks/new"
					className="px-3 py-1 bg-white text-black rounded hover:bg-gray-800"
				>
					Create Task
				</Link>
				<Link
					href="/events/new"
					className="px-3 py-1 bg-white text-black rounded hover:bg-gray-800"
				>
					Create Event
				</Link>
			</div>

			<h1>{`Hello ${session.user.name}`}</h1>
			<ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
				{users.map(user => (
					<li key={user.id} className="mb-2">
						{user.name}
					</li>
				))}
			</ol>
			{/* Example Chart */}
			<div className="max-w-sm mt-6">
				<TaskSummaryChart tasks={tasks} />
			</div>
			{/* Example Component Box */}
			<div className="w-sm">
				<ComponentBox title="Title">
					Content
					<ul className="list-disc list-inside">
						<li>Item 1</li>
						<li>Item 2</li>
						<li>Item 3</li>
						<li>Item 4</li>
					</ul>
				</ComponentBox>
			</div>

			{/* Example Upcoming Box */}
			<div className="w-sm mt-2">
				<UpcomingTaskBox tasks={tasks} />
			</div>

			<div>
				<Calendar
					className="w-sm"
					markedDates={[new Date('2025-08-20')]}
				></Calendar>
			</div>
		</div>
	);
}
