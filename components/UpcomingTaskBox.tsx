'use client';
import Link from 'next/link';
import {formatInstant} from '@/lib/formatTime';
import ComponentBox from './ComponentBox';
import type {Task} from '@/lib/types';

// Sorting and selecting number of items will be the responsibility of the parent.
export default function UpcomingTaskBox({tasks}: {tasks: Task[]}) {
	return (
		<ComponentBox title={'Upcoming Tasks'}>
			{tasks.map(task => (
				<Link href={`/${task.workspaceId}/tasks/${task.id}`} key={task.id}>
					<div className="flex flex-row items-center">
						{task.deadline !== null && (
							<div className="mr-2">
								<div
									className={`w-4 h-4 rounded-full border-2 border-black bg-black`}
								/>
							</div>
						)}
						<div className="grow">{task.title}</div>
						<div>{task.deadline && formatInstant(task.deadline)}</div>
					</div>
				</Link>
			))}
		</ComponentBox>
	);
}
