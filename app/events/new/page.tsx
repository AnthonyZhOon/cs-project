import CreateForm from '@/components/CreateForm';

export default function NewEventPage() {
	return (
		<div className="max-w-3xl mx-auto p-4">
			<CreateForm
				title="Create Event"
				submitText="Create Event"
				fields={[
					{
						name: 'eventName',
						label: 'Event Name',
						placeholder: 'Enter the event name',
						type: 'text',
					},
					{name: 'tags', label: 'Tags', placeholder: 'Add a tag', type: 'text'},
					{
						name: 'attendee',
						label: 'Attendee',
						placeholder: 'Add an attendee',
						type: 'text',
					},
					{name: 'startDate', label: 'Start date', type: 'date'},
					{name: 'endDate', label: 'End date', type: 'date'},
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
