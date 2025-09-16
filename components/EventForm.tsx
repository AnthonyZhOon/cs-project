import {redirect} from 'next/navigation';
import CreateForm from '@/components/CreateForm';
import Input from '@/components/inputs/Input';
import MultiSuggestInput from '@/components/inputs/MultiSuggestInput';
import Textarea from '@/components/inputs/Textarea';
import api from '@/lib/api';
import {getWorkspaceId} from '@/lib/util';
import type {Event} from '@/lib/types';

interface EventFormProps {
	event?: Event & {tags: {name: string}[]; attendees: {id: string}[]};
	availableTags: string[];
	members: {id: string; name: string}[];
}

export default function EventForm({
	event,
	availableTags,
	members,
}: EventFormProps) {
	const isEditing = !!event;

	const formatDT = (d?: Date): string =>
		d
			? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
					.toISOString()
					.slice(0, 16)
			: '';

	const formattedStart = formatDT(event?.start);
	const formattedEnd = formatDT(event?.end);

	return (
		<div className="max-w-3xl mx-auto p-4">
			<CreateForm
				formTitle={isEditing ? 'Edit Event' : 'Create Event'}
				submitText={isEditing ? 'Update Event' : 'Create Event'}
				cancelHref="/events"
				deleteAction={
					isEditing
						? async () => {
								'use server';
								await api.deleteEvent(event.id);
								redirect('/events');
							}
						: undefined
				}
				action={async (formData: FormData) => {
					'use server';
					const attendees = formData.getAll('attendees') as string[];

					const payload = {
						title: formData.get('title') as string,
						description: formData.get('description') as string,
						tags: formData.getAll('tags') as string[],
						...(attendees.length ? {attendees} : {}),
						start: new Date(formData.get('start') as string),
						end: new Date(formData.get('end') as string),
					};

					await (event
						? api.updateEvent(event.id, payload)
						: api.createEvent({
								workspaceId: await getWorkspaceId(),
								...payload,
							}));

					redirect('/events');
				}}
			>
				<Input
					name="title"
					label="Title"
					placeholder="Enter event title"
					defaultValue={event?.title ?? ''}
					required
				/>

				<MultiSuggestInput
					name="tags"
					label="Tags"
					placeholder="Add a tag"
					options={availableTags.map(o => ({value: o, label: o}))}
					defaultValue={event?.tags.map(t => t.name) ?? []}
					allowCreate
				/>

				<MultiSuggestInput
					name="attendees"
					label="Attendees"
					placeholder="Search members…"
					options={members.map(m => ({value: m.id, label: m.name}))}
					defaultValue={event?.attendees.map(a => a.id) ?? []}
				/>

				<Input
					name="start"
					label="Start"
					type="datetime-local"
					required
					defaultValue={formattedStart}
				/>
				<Input
					name="end"
					label="End"
					type="datetime-local"
					required
					defaultValue={formattedEnd}
				/>

				<Textarea
					name="description"
					label="Description"
					placeholder="Enter the description"
					defaultValue={event?.description ?? ''}
				/>
			</CreateForm>
		</div>
	);
}
