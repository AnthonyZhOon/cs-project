import Link from 'next/link';
import ComponentBox from '@/components/ComponentBox';
import {InfoRow, TagsRow} from '@/components/InfoRow';
import {formatInstant} from '@/lib/formatTime';
import type {Task, TaskWithAssigneesAndTags} from '@/lib/types';

const Status = ({
	status,
	className = '',
}: {
	status: Task['status'];
	className?: string;
}) => {
	const statusText = (status: Task['status']): string => {
		switch (status) {
			case 'TODO':
				return '📝 Todo';
			case 'IN_PROGRESS':
				return '🔄 In Progress';
			case 'COMPLETE':
				return '✅ Complete';
		}
	};
	const getStatusColor = (status: Task['status']) => {
		switch (status) {
			case 'COMPLETE':
				return 'text-green-600';
			case 'IN_PROGRESS':
				return 'text-blue-600';
			case 'TODO':
				return 'text-yellow-600';
		}
	};
	return (
		<InfoRow
			label="Status"
			text={statusText(status)}
			className={`${getStatusColor(status)} ${className}`}
		/>
	);
};

const Priority = ({
	priority,
	className = '',
}: {
	priority: Task['priority'];
	className?: string;
}) => {
	const getPriorityColor = (priority: Task['priority']) => {
		switch (priority) {
			case 'HIGH':
				return 'text-red-600';
			case 'MEDIUM':
				return 'text-yellow-600';
			case 'LOW':
				return 'text-green-600';
			default:
				return 'text-gray-600';
		}
	};

	const priorityText = (priority: Task['priority']): string => {
		switch (priority) {
			case 'HIGH':
				return '🔥 High';
			case 'MEDIUM':
				return '⚠️ Medium';
			case 'LOW':
				return '✅ Low';
			default:
				return '❓ Unknown';
		}
	};
	return (
		<InfoRow
			label="Priority"
			text={priorityText(priority)}
			className={`${getPriorityColor(priority)} ${className}`}
		/>
	);
};

export default function TaskComponent({
	task,
	className = '',
}: {
	task: NonNullable<TaskWithAssigneesAndTags>;
	className?: string;
}) {
	const taskIcon = '📋';
	const taskTitle = `${taskIcon} ${task.title}`;

	return (
		<Link
			href={`/tasks/${task.id}`}
			className="block hover:opacity-80 transition-opacity"
		>
			{/* Add an outline to the task component */}
			<ComponentBox title={taskTitle} className={`max-w-sm ${className}`}>
				<div className="p-2 space-y-1">
					<Status status={task.status} />
					<Priority priority={task.priority} />
					<TagsRow
						tags={task.tags.map(tag => tag.name)}
						className="text-gray-600"
					/>
					{/* Footer for assignees and due date */}
					<div className="flex justify-between items-center text-sm text-gray-600">
						<span>{task.assignees.map(a => a.name).join(', ')}</span>
						<span>
							{task.deadline ? formatInstant(task.deadline) : 'No due date set'}
						</span>
					</div>
					<p className="text-sm text-gray-800 leading-relaxed mb-1">
						{task.description}
					</p>
				</div>
			</ComponentBox>
		</Link>
	);
}
