import Link from 'next/link';
import Calendar from '@/components/Calendar';
import ComponentBox from '@/components/ComponentBox';
import TaskSummaryChart from '@/components/TaskSummary';
import UpcomingBox from '@/components/UpcomingBox';
import prisma from '@/lib/prisma';
import {getWorkspaceId} from '@/lib/util';

// const getFeed = () => {
// 	const feed = [
// 		{
// 			id: '1',
// 			title: 'Prisma is the perfect ORM for Next.js',
// 			content:
// 				'[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!',
// 			published: false,
// 			author: {
// 				name: 'Nikolas Burk',
// 				email: 'burk@prisma.io',
// 			},
// 		},
// 		{
// 			id: '2',
// 			title: 'Prisma is the perfect ORM for Next.js',
// 			content:
// 				'[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!',
// 			published: false,
// 			author: {
// 				name: 'Nikolas Burk',
// 				email: 'burk@prisma.io',
// 			},
// 		},
// 	]
// 	return feed
// }

const getUsers = async () => {
	const users = await prisma.user.findMany();
	return users;
};

const exampleTasks = [
	{
		name: 'Task 1',
		date: new Date('01-01-01'),
		url: '',
		complete: true,
	},
	{
		name: 'Task 2',
		date: new Date('02-02-02'),
		url: '',
		complete: false,
	},
	{
		name: 'Task 3',
		date: new Date('03-03-03'),
		url: '',
		complete: false,
	},
];

export default async function Blog() {
	const users = await getUsers();
	const workspaceId = await getWorkspaceId();
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

			<ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
				{users.map(user => (
					<li key={user.id} className="mb-2">
						{user.name}
					</li>
				))}
			</ol>
			{/* Example Chart */}
			<div className="max-w-sm mt-6">
				<TaskSummaryChart todo={30} inProgress={40} done={30} />
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
				<UpcomingBox itemType="Task" items={exampleTasks} />
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
