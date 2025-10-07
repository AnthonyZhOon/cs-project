'use client';
import Link from 'next/link';
import {formatInstant} from '@/lib/formatTime';
import ComponentBox from './ComponentBox';
import type {Event} from '@/lib/types';

export default function UpcomingEventBox({events}: {events: Event[]}) {
	return (
		<ComponentBox title={'Upcoming Events'}>
			{events.map(event => (
				<Link href={`/${event.workspaceId}/events/${event.id}`} key={event.id}>
					<div className="flex flex-row items-center">
						<div className="grow">{event.title}</div>
						<div>{formatInstant(event.end)}</div>
					</div>
				</Link>
			))}
		</ComponentBox>
	);
}
