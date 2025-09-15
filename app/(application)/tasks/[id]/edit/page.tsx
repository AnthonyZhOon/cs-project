import {redirect} from 'next/navigation';
import CreateForm from '@/components/CreateForm';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import TagsInput from '@/components/inputs/TagsInput';
import Textarea from '@/components/inputs/Textarea';
import api from '@/lib/api';
import {Priority} from '@/lib/types';
import {getWorkspaceId} from '@/lib/util';

interface EditTaskPageProps {
	params: {
		id: string;
	};
}

export default async function EditTaskPage({params}: EditTaskPageProps) {
	const task = await api.getTaskWithAssigneesAndTags(params.id);

	if (!task) redirect('/tasks');

	// Format the deadline for datetime-local input
	const formattedDeadline = task.deadline
		? new Date(
				task.deadline.getTime() - task.deadline.getTimezoneOffset() * 60000,
			)
				.toISOString()
				.slice(0, 16)
		: '';

	return (
		<div className="max-w-3xl mx-auto p-4">
			<CreateForm
				formTitle="Edit Task"
				submitText="Update Task"
				action={async formData => {
					'use server';
					const deadline = formData.get('deadline') as string;
					const priority = formData.get('priority') as '' | Priority;
					await api.updateTask(params.id, {
						title: formData.get('title') as string,
						description: formData.get('description') as string,
						tags: formData.getAll('tags') as string[],
						...(priority ? {priority} : {}),
						...(deadline ? {deadline: new Date(deadline)} : {}),
					});
					redirect('/tasks');
				}}
			>
				<Input
					name="title"
					label="Title"
					placeholder="Enter task title"
					defaultValue={task.title}
					required
				/>
				<TagsInput
					name="tags"
					options={await api.getTags(await getWorkspaceId())}
					defaultValue={task.tags.map(tag => tag.name)}
				/>
				{/* <Select name="assignee" label="Assign">
					<option>User 1</option>
					<option>User 2</option>
				</Select> */}
				<Select
					name="priority"
					label="Priority"
					defaultValue={task.priority ?? ''}
				>
					<option value="">Select&hellip;</option>
					<option value={Priority.LOW}>Low</option>
					<option value={Priority.MEDIUM}>Medium</option>
					<option value={Priority.HIGH}>High</option>
				</Select>
				<Input
					name="deadline"
					label="Due date"
					type="datetime-local"
					defaultValue={formattedDeadline}
				/>
				{/* <Select name="dependency" label="Task Dependency">
					<option>Task B</option>
					<option>Task B</option>
				</Select> */}
				<Textarea
					name="description"
					label="Description"
					placeholder="Enter the description"
					defaultValue={task.description ?? ''}
				/>
			</CreateForm>
		</div>
	);
}
