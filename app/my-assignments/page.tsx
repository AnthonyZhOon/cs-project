import Link from 'next/link';
import MissingAuthError from '@/components/MissingAuthError';
import api from '@/lib/api';
import {auth0} from '@/lib/auth0';
import {formatInstant, formatRange} from '@/lib/formatTime';
import type {Event, Task, Workspace} from '@/lib/types';

// Simple task list item component
const TaskListItem = ({
	task,
	workspace,
}: {
	task: Task & {assignees: {name: string}[]; tags: {name: string}[]};
	workspace: Workspace;
}): React.JSX.Element => {
	const getPriorityColor = (priority: Task['priority']) => {
		switch (priority) {
			case 'HIGH':
				return 'bg-red-100 text-red-800';
			case 'MEDIUM':
				return 'bg-yellow-100 text-yellow-800';
			case 'LOW':
				return 'bg-green-100 text-green-800';
		}
	};

	const getStatusColor = (status: Task['status']) => {
		switch (status) {
			case 'COMPLETE':
				return 'text-green-600';
			case 'IN_PROGRESS':
				return 'text-blue-600';
			case 'TODO':
				return 'text-gray-600';
		}
	};

	const statusIcon = (status: Task['status']) => {
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
			href={`/${workspace.id}/tasks/${task.id}`}
			className="block p-3 bg-white border border-black rounded-lg hover:shadow-md transition-all"
		>
			<div className="flex items-center gap-3">
				<span className={getStatusColor(task.status)}>
					{statusIcon(task.status)}
				</span>
				<h3 className="font-semibold text-gray-900 truncate min-w-0 flex-shrink">
					{task.title}
				</h3>
				<span className="text-sm text-gray-400 flex-shrink-0">in</span>
				<span className="text-sm font-medium text-gray-700 flex-shrink-0">{workspace.name}</span>
				<div className="flex items-center gap-2 text-xs ml-auto flex-shrink-0">
					<span
						className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}
					>
						{task.priority}
					</span>
					{task.deadline && (
						<span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full whitespace-nowrap">
							📅 {formatInstant(task.deadline)}
						</span>
					)}
					{task.tags.length > 0 && task.tags[0] && (
						<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
							{task.tags[0].name}
						</span>
					)}
					{task.tags.length > 1 && (
						<span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
							+{task.tags.length - 1}
						</span>
					)}
				</div>
			</div>
		</Link>
	);
};

// Simple event list item component
const EventListItem = ({
	event,
	workspace,
}: {
	event: Event & {attendees: {name: string}[]; tags: {name: string}[]};
	workspace: Workspace;
}): React.JSX.Element => (
	<Link
		href={`/${workspace.id}/events/${event.id}`}
		className="block p-3 bg-white border border-black rounded-lg hover:shadow-md transition-all"
	>
		<div className="flex items-center gap-3">
			<span>📅</span>
			<h3 className="font-semibold text-gray-900 truncate min-w-0 flex-shrink">
				{event.title}
			</h3>
			<span className="text-sm text-gray-400 flex-shrink-0">in</span>
			<span className="text-sm font-medium text-gray-700 flex-shrink-0">{workspace.name}</span>
			<div className="flex items-center gap-2 text-xs ml-auto flex-shrink-0">
				<span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
					🕒 {formatRange(event.start, event.end)}
				</span>
				{event.tags.length > 0 && event.tags[0] && (
					<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
						{event.tags[0].name}
					</span>
				)}
				{event.tags.length > 1 && (
					<span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
						+{event.tags.length - 1}
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

	// Get all workspaces for the user
	const workspaces = await api.getWorkspaces(userId);

	// Get all tasks and events across all workspaces
	const tasksAndEventsPromises = workspaces.flatMap(workspace => [
		api
			.getTasks({workspaceId: workspace.id, assigneeId: userId})
			.then(tasks => ({workspace, tasks})),
		api
			.getEvents({workspaceId: workspace.id, attendeeId: userId})
			.then(events => ({workspace, events})),
	]);

	const results = await Promise.all(tasksAndEventsPromises);

	// Separate tasks and events with their workspace info
	const tasksWithWorkspace: {
		task: Task & {assignees: {name: string}[]; tags: {name: string}[]};
		workspace: Workspace;
	}[] = [];
	const eventsWithWorkspace: {
		event: Event & {attendees: {name: string}[]; tags: {name: string}[]};
		workspace: Workspace;
	}[] = [];

	results.forEach(result => {
		if ('tasks' in result) {
			result.tasks.forEach(task => {
				tasksWithWorkspace.push({task, workspace: result.workspace});
			});
		} else if ('events' in result) {
			result.events.forEach(event => {
				eventsWithWorkspace.push({event, workspace: result.workspace});
			});
		}
	});

	// Sort tasks by deadline
	tasksWithWorkspace.sort((a, b) => {
		if (!a.task.deadline && !b.task.deadline) return 0;
		if (!a.task.deadline) return 1;
		if (!b.task.deadline) return -1;
		return a.task.deadline.getTime() - b.task.deadline.getTime();
	});

	// Sort events by start time
	eventsWithWorkspace.sort(
		(a, b) => a.event.start.getTime() - b.event.start.getTime(),
	);

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
					<span className="text-sm text-gray-500">
						({tasksWithWorkspace.length})
					</span>
				</div>

				{tasksWithWorkspace.length === 0 ? (
					<div className="p-8 bg-white border border-black rounded-lg text-center">
						<p className="text-sm text-gray-600">
							No tasks assigned to you at the moment.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{tasksWithWorkspace.map(({task, workspace}) => (
							<TaskListItem key={task.id} task={task} workspace={workspace} />
						))}
					</div>
				)}
			</section>

			{/* Events Section */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<h2 className="text-xl font-bold">Events</h2>
					<span className="text-sm text-gray-500">
						({eventsWithWorkspace.length})
					</span>
				</div>

				{eventsWithWorkspace.length === 0 ? (
					<div className="p-8 bg-white border border-black rounded-lg text-center">
						<p className="text-sm text-gray-600">
							No events scheduled for you at the moment.
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{eventsWithWorkspace.map(({event, workspace}) => (
							<EventListItem
								key={event.id}
								event={event}
								workspace={workspace}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
