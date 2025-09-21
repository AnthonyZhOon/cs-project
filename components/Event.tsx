import ComponentBox from '@/components/ComponentBox';
import {PillRow} from '@/components/InfoRow';
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
				{tags.length > 0 && (
					<PillRow
						label="Tags"
						tags={tags.map(t => t.name)}
						className="text-gray-600"
					/>
				)}

				<PillRow
					tags={attendees.map(a => a.name)}
					label="Members"
					className="text-gray-600"
				/>

				<p className="text-sm text-gray-800 leading-relaxed">
					{event.description}
				</p>

				<div className="text-xs text-gray-600">
					{formatRange(event.start, event.end)}
				</div>
			</div>
		</ComponentBox>
	);
}
