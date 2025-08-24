import CreateForm from '@/components/CreateForm';
import Input from '@/components/inputs/Input';
import Select from '@/components/inputs/Select';
import Textarea from '@/components/inputs/Textarea';
import api from '@/lib/api';
import {getWorkspaceId} from '@/lib/util';

export default function NewEventPage() {
	return (
		<div className="max-w-3xl mx-auto p-4">
			<CreateForm
				formTitle="Create Event"
				submitText="Create Event"
				action={async formData => {
					'use server';
					const id = await api.createEvent({
						workspaceId: await getWorkspaceId(),
						title: formData.get('title') as string,
						description: formData.get('description') as string,
						start: new Date(formData.get('start') as string),
						end: new Date(formData.get('end') as string),
					});
					// TODO: do something useful
					console.log(`Created event ${id}`);
				}}
			>
				<Input
					name="title"
					label="Title"
					placeholder="Enter the event title"
					type="text"
					required
					minLength={1}
				/>
				{/* <Input name="tags" label="Tags" placeholder="Add a tag" type="text" /> */}
				{/* <Input name="attendee" label="Attendee" placeholder="Add an attendee" type="text" /> */}
				<Input name="start" label="Start date" type="datetime-local" required />
				<Input name="end" label="End date" type="datetime-local" required />
				<Textarea
					name="description"
					label="Description"
					placeholder="Enter the description"
				/>
			</CreateForm>
		</div>
	);
}
