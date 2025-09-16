import Link from 'next/link';
import ComponentBox from '@/components/ComponentBox';
import {InfoRow, PillRow} from '@/components/InfoRow';
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
		<ComponentBox title={taskTitle} className={`max-w-sm ${className}`}>
			<div className="p-2 space-y-1">
				<Status status={task.status} />
				<Priority priority={task.priority} />
				{task.tags.length > 0 && (
					<PillRow
						label="Tags"
						tags={task.tags.map(tag => tag.name)}
						className="text-gray-600"
					/>
				)}
				<PillRow
					tags={task.assignees.map(a => a.name)}
					label="Assignees"
					className="text-gray-600"
				/>
				<p className="text-sm text-gray-800 leading-relaxed">
					{task.description}
				</p>
				{task.deadline != null && (
					<div className="text-xs text-gray-600">
						{formatInstant(task.deadline)}
					</div>
				)}
			</div>
		</ComponentBox>
	);
}
