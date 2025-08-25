import CreateForm from '@/components/CreateForm';

export default function NewTaskPage() {
	return (
		<div className="max-w-3xl mx-auto p-4">
			<CreateForm
				title="Create Task"
				submitText="Create Task"
				fields={[
					{
						name: 'taskName',
						label: 'Task Name',
						placeholder: 'Enter task name',
						type: 'text',
					},
					{name: 'tags', label: 'Tags', placeholder: 'Add a tag', type: 'text'},
					{
						name: 'assignee',
						label: 'Assign',
						type: 'select',
						options: ['User 1', 'User 2'],
					},
					{
						name: 'priority',
						label: 'Priority',
						type: 'select',
						options: ['Low', 'Medium', 'High'],
					},
					{name: 'dueDate', label: 'Due date', type: 'date'},
					{
						name: 'dependency',
						label: 'Task Dependency',
						type: 'select',
						options: ['Task A', 'Task B'],
					},
					{
						name: 'description',
						label: 'Description',
						placeholder: 'Enter the description',
						type: 'textarea',
					},
				]}
			/>
		</div>
	);
}
