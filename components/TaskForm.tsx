import {redirect} from 'next/navigation';
import CreateForm from '@/components/CreateForm';
import Input from '@/components/inputs/Input';
import MultiSuggestInput from '@/components/inputs/MultiSuggestInput';
import Select from '@/components/inputs/Select';
import Textarea from '@/components/inputs/Textarea';
import api from '@/lib/api';
import {Priority, TaskStatus} from '@/lib/types';
import type {FullTask} from '@/lib/types';

interface TaskFormProps {
	task?: FullTask;
	availableTags: string[];
	availableMembers: {id: string; name: string}[];
	availableDependencies: {id: string; title: string}[];
	workspaceId: string;
}

export default function TaskForm({
	task,
	availableTags,
	availableMembers,
	availableDependencies,
	workspaceId,
}: TaskFormProps) {
	const isEditing = !!task;

	// Format the deadline for datetime-local input
	const formattedDeadline = task?.deadline
		? new Date(
				task.deadline.getTime() - task.deadline.getTimezoneOffset() * 60000,
			)
				.toISOString()
				.slice(0, 16)
		: '';

	return (
		<div className="max-w-3xl mx-auto p-4">
			<CreateForm
				formTitle={isEditing ? 'Edit Task' : 'Create Task'}
				submitText={isEditing ? 'Update Task' : 'Create Task'}
				cancelHref={`/${workspaceId}/tasks`}
				deleteAction={
					isEditing
						? async () => {
								'use server';
								await api.deleteTask(task.id);
								redirect(`/${workspaceId}/tasks`);
							}
						: undefined
				}
				action={async (formData: FormData) => {
					'use server';
					const deadline = formData.get('deadline') as string;
					const priority = formData.get('priority') as '' | Priority;
					const status = formData.get('status') as '' | TaskStatus;
					const assignees = formData.getAll('assignees') as string[];
					const dependencies = formData.getAll('dependencies') as string[];

					const taskData = {
						title: formData.get('title') as string,
						description: formData.get('description') as string,
						tags: formData.getAll('tags') as string[],
						assignees,
						dependencies,
						...(priority ? {priority} : {}),
						...(status ? {status} : {}),
						...(deadline ? {deadline: new Date(deadline)} : {}),
					};

					await (task
						? api.updateTask(task.id, taskData)
						: api.createTask({
								workspaceId,
								...taskData,
							}));

					redirect(`/${workspaceId}/tasks`);
				}}
			>
				<Input
					name="title"
					label="Title"
					placeholder="Enter task title"
					defaultValue={task?.title ?? ''}
					required
				/>
				<MultiSuggestInput
					name="tags"
					label="Tags"
					placeholder="Add a tag"
					options={availableTags.map(o => ({value: o, label: o}))}
					defaultValue={task?.tags.map(tag => tag.name) ?? []}
					allowCreate
				/>
				<MultiSuggestInput
					name="assignees"
					label="Assignees"
					placeholder="Search members…"
					options={availableMembers.map(m => ({value: m.id, label: m.name}))}
					defaultValue={task?.assignees.map(a => a.id) ?? []}
				/>
				<MultiSuggestInput
					name="dependencies"
					label="Dependencies"
					placeholder="Search tasks…"
					options={availableDependencies.map(m => ({
						value: m.id,
						label: m.title,
					}))}
					defaultValue={task?.dependencies.map(t => t.id) ?? []}
				/>
				<Select name="status" label="Status" defaultValue={task?.status ?? ''}>
					<option value="">Select&hellip;</option>
					<option value={TaskStatus.TODO}>To do</option>
					<option value={TaskStatus.IN_PROGRESS}>In progress</option>
					<option value={TaskStatus.COMPLETE}>Complete</option>
				</Select>
				<Select
					name="priority"
					label="Priority"
					defaultValue={task?.priority ?? ''}
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
					defaultValue={task?.description ?? ''}
				/>
			</CreateForm>
		</div>
	);
}
