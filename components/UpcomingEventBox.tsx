'use client';
import {formatInstant} from '@/lib/formatTime';
import ComponentBox from './ComponentBox';
import type {Event} from '@/lib/types';

export default function UpcomingEventBox({events}: {events: Event[]}) {
	return (
		<ComponentBox title={'Upcoming Events'}>
			{events.map((event, index) => (
				<div className="flex flex-row items-center" key={index}>
					{event.end < new Date() && (
						<div className="mr-2">
							<div
								className={`w-4 h-4 rounded-full border-2 border-black bg-black`}
							/>
						</div>
					)}
					<div className="grow">{event.title}</div>
					<div>{formatInstant(event.end)}</div>
				</div>
			))}
		</ComponentBox>
	);
}
