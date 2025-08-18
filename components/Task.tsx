import ComponentBox from '@/components/ComponentBox';
import Tags from '@/components/Tags';
import type {Task, TaskWithAssignessAndTags} from '@/lib/types';

export const exampleTask: NonNullable<TaskWithAssignessAndTags> = {
	id: '1',
	title: 'Complete the project report',
	description:
		'Finalize the project report and submit it by the end of the week.',
	status: 'IN_PROGRESS',
	priority: 'HIGH',
	deadline: new Date('2023-10-31T23:59:59'),
	visibility: 'MEMBER',
	workspaceId: 'workspace-123',
	assignees: [
		{name: 'John Doe', id: '0', email: 'jdoe@mail.com'},
		{name: 'Jane Smith', id: '1', email: 'jsmith@mail.com'},
	],
	tags: [{name: 'report'}, {name: 'project'}, {name: 'deadline'}],
};

const LeftRightLabelContents = ({
	label,
	text,
	className = '',
}: {
	label: string;
	text: string | React.ReactNode;
	className?: string;
}) => (
	<div className="flex justify-between items-center mb-1">
		<span className="text-sm text-gray-600">{label}</span>

		{typeof text === 'string' ? (
			<span className={`text-sm font-medium ${className}`}>{text}</span>
		) : (
			<div>{text}</div>
		)}
	</div>
);

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
		<LeftRightLabelContents
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
		<LeftRightLabelContents
			label="Priority"
			text={priorityText(priority)}
			className={`${getPriorityColor(priority)} ${className}`}
		/>
	);
};

const TagsBox = ({tags}: {tags: string[]}) => (
	<LeftRightLabelContents
		label="Tags"
		text={Tags(tags)}
		className="text-gray-600"
	/>
);

export default function TaskComponent({
	task,
	className = '',
}: {
	task: NonNullable<TaskWithAssignessAndTags>;
	className?: string;
}) {
	const taskIcon = '📋';
	const taskTitle = `${taskIcon} ${task.title}`;

	return (
		// Add an outline to the task component
		<ComponentBox title={taskTitle} className={`max-w-sm ${className}`}>
			<div className="task-details p-2 mb-2 space-y-0.5 border-gray-300 rounded-lg">
				<Status status={task.status} />
				<Priority priority={task.priority} />
				<TagsBox tags={task.tags.map(tag => tag.name)} />
				<p className="text-sm text-gray-800 leading-relaxed mb-1">
					{task.description}
				</p>
				{/* Footer for assignees and due date */}
				<div className="flex justify-between items-center text-sm text-gray-600">
					<span>{task.assignees.map(a => a.name).join(', ')}</span>
					<span>{task.deadline?.toLocaleString() ?? 'No due date set'}</span>
				</div>
			</div>
		</ComponentBox>
	);
}
