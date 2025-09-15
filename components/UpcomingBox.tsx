'use client';
import ComponentBox from './ComponentBox';

interface Item {
	name: string;
	date: Date;
	url: string;
	complete?: boolean;
}

// Sorting and selecting number of items will be the responsibility of the parent.
export default function UpcomingBox({
	itemType,
	items,
}: {
	itemType: string;
	items: Item[];
}) {
	return (
		<ComponentBox title={itemType + 's'}>
			{items.map((item, index) => (
				<div className="flex flex-row items-center" key={index}>
					{item.complete !== undefined && (
						<div className="mr-2">
							<div
								className={`w-4 h-4 rounded-full border-2 border-black ${
									item.complete ? 'bg-black' : 'bg-transparent'
								}`}
							/>
						</div>
					)}
					<div className="grow">{item.name}</div>
					<div>{item.date.toLocaleDateString()}</div>
				</div>
			))}
		</ComponentBox>
	);
}
