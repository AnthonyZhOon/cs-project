import Link from 'next/link';
import MissingAuthError from '@/components/MissingAuthError';
import api from '@/lib/api';
import {auth0} from '@/lib/auth0';
import {formatInstant, formatRange} from '@/lib/formatTime';

type Task = Awaited<ReturnType<typeof api.getAllTasks>>[number];
type Event = Awaited<ReturnType<typeof api.getAllEvents>>[number];

// Simple task list item component
const TaskListItem = ({
	id,
	title,
	status,
	priority,
	deadline,
	tags,
	workspace,
}: Task) => {
	const getPriorityColour = (priority: Task['priority']): string => {
		switch (priority) {
			case 'HIGH':
				return 'bg-red-100 text-red-800';
			case 'MEDIUM':
				return 'bg-yellow-100 text-yellow-800';
			case 'LOW':
				return 'bg-green-100 text-green-800';
			case null:
				return '';
		}
	};

	const getStatusColour = (status: Task['status']): string => {
		switch (status) {
			case 'COMPLETE':
				return 'text-green-600';
			case 'IN_PROGRESS':
				return 'text-blue-600';
			case 'TODO':
				return 'text-gray-600';
		}
	};

	const statusIcon = (status: Task['status']): string => {
		switch (status) {
			case 'COMPLETE':
				return '✅';
			case 'IN_PROGRESS':
				return '🔄';
			case 'TODO':
				return '📝';
		}
	};

	return (
		<Link
			href={`/${workspace.id}/tasks/${id}`}
			className="block p-3 bg-white border border-black rounded-lg hover:shadow-md transition-all"
		>
			<div className="flex items-center gap-3">
				<span className={getStatusColour(status)}>{statusIcon(status)}</span>
				<h3 className="font-semibold text-gray-900 truncate min-w-0 flex-shrink">
					{title}
				</h3>
				<span className="text-sm text-gray-400 flex-shrink-0">in</span>
				<span className="text-sm font-medium text-gray-700 flex-shrink-0">
					{workspace.name}
				</span>
				<div className="flex items-center gap-2 text-xs ml-auto flex-shrink-0">
					<span
						className={`px-2 py-1 rounded-full font-medium ${getPriorityColour(priority)}`}
					>
						{priority}
					</span>
					{deadline && (
						<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap">
							📅 {formatInstant(deadline)}
						</span>
					)}
					{tags.length > 0 && tags[0] && (
						<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
							{tags[0].name}
						</span>
					)}
					{tags.length > 1 && (
						<span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
							+{tags.length - 1}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
};

// Simple event list item component
const EventListItem = ({id, title, start, end, tags, workspace}: Event) => (
	<Link
		href={`/${workspace.id}/events/${id}`}
		className="block p-3 bg-white border border-black rounded-lg hover:shadow-md transition-all"
	>
		<div className="flex items-center gap-3">
			<span>📅</span>
			<h3 className="font-semibold text-gray-900 truncate min-w-0 flex-shrink">
				{title}
			</h3>
			<span className="text-sm text-gray-400 flex-shrink-0">in</span>
			<span className="text-sm font-medium text-gray-700 flex-shrink-0">
				{workspace.name}
			</span>
			<div className="flex items-center gap-2 text-xs ml-auto flex-shrink-0">
				<span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
					🕒 {formatRange(start, end)}
				</span>
				{tags.length > 0 && tags[0] && (
					<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
						{tags[0].name}
					</span>
				)}
				{tags.length > 1 && (
					<span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
						+{tags.length - 1}
					</span>
				)}
			</div>
		</div>
	</Link>
);

export default async function MyAssignmentsPage() {
	const session = await auth0.getSession();
	if (session === null) return <MissingAuthError />;

	const userId = session.user.sub;

	const [tasks, events] = await Promise.all([
		api.getAllTasks(userId),
		api.getAllEvents(userId),
	]);

	return (
		<div className="p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">My Assignments</h1>
				<Link
					href="/workspaces"
					className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
				>
					← Back to Workspaces
				</Link>
			</div>

			{/* Tasks Section */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<h2 className="text-xl font-bold">Tasks</h2>
					<span className="text-sm text-gray-500">({tasks.length})</span>
				</div>

				{tasks.length === 0 ? (
					<div className="p-8 bg-white border border-black rounded-lg text-center">
						<p className="text-sm text-gray-600">
							No tasks assigned to you at the moment.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{tasks.map(task => (
							<TaskListItem {...task} />
						))}
					</div>
				)}
			</section>

			{/* Events Section */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<h2 className="text-xl font-bold">Events</h2>
					<span className="text-sm text-gray-500">({events.length})</span>
				</div>

				{events.length === 0 ? (
					<div className="p-8 bg-white border border-black rounded-lg text-center">
						<p className="text-sm text-gray-600">
							No events scheduled for you at the moment.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{events.map(event => (
							<EventListItem {...event} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
