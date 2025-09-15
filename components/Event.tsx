import ComponentBox from '@/components/ComponentBox';
import {TagsRow} from '@/components/InfoRow';
import {formatRange} from '@/lib/formatTime';
import type {Event} from '@/lib/types';

// Removed top Time row; footer will display the range instead.

export default function EventComponent({
	event,
	className = '',
	tags = [],
	attendees = [],
}: {
	event: Event;
	className?: string;
	tags?: {name: string}[];
	attendees?: {name: string}[];
}) {
	const icon = '📅';
	const title = `${icon} ${event.title}`;
	return (
		<ComponentBox title={title} className={`max-w-sm ${className}`}>
			<div className="p-2 space-y-1">
				<TagsRow tags={tags.map(t => t.name)} className="text-gray-600" />
				<p className="text-sm text-gray-800 leading-relaxed mb-1">
					{event.description}
				</p>
				<div className="flex justify-between items-center text-sm text-gray-600">
					<span>{attendees.map(a => a.name).join(', ')}</span>
					<span>{formatRange(event.start, event.end)}</span>
				</div>
			</div>
		</ComponentBox>
	);
}
