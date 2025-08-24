import CreateForm from '@/components/CreateForm';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import Textarea from '@/components/inputs/Textarea';
import api from '@/lib/api';
import {Priority} from '@/lib/types';
import {getWorkspaceId} from '@/lib/util';

export default function NewTaskPage() {
	return (
		<div className="max-w-3xl mx-auto p-4">
			<CreateForm
				formTitle="Create Task"
				submitText="Create Task"
				action={async formData => {
					'use server';
					const deadline = formData.get('deadline') as string;
					const priority = formData.get('priority') as '' | Priority;
					const id = await api.createTask({
						workspaceId: await getWorkspaceId(),
						title: formData.get('title') as string,
						description: formData.get('description') as string,
						...(priority ? {priority} : {}),
						...(deadline ? {deadline: new Date(deadline as string)} : {}),
					});
					// TODO: do something useful
					console.log(`Created task ${id}`);
				}}
			>
				<Input
					name="title"
					label="Title"
					placeholder="Enter task title"
					required
					minLength={1}
				/>
				{/* <Input name="tags" label="Tags" placeholder="Add a tag" type="text" /> */}
				{/* <Select name="assignee" label="Assign">
					<option>User 1</option>
					<option>User 2</option>
				</Select> */}
				<Select name="priority" label="Priority">
					<option value="">Select&hellip;</option>
					<option value={Priority.LOW}>Low</option>
					<option value={Priority.MEDIUM}>Medium</option>
					<option value={Priority.HIGH}>High</option>
				</Select>
				<Input name="deadline" label="Due date" type="datetime-local" />
				{/* <Select name="dependency" label="Task Dependency">
					<option>Task B</option>
					<option>Task B</option>
				</Select> */}
				<Textarea
					name="description"
					label="Description"
					placeholder="Enter the description"
				/>
			</CreateForm>
		</div>
	);
}
