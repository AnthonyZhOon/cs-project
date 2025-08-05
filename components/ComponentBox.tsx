'use client';

export default function UpcomingBox({ children, title }: { children: React.ReactNode, title: string }) {

	return (
		<div className="w-full border border-black rounded-md">
			<div className="border-b p-1 font-bold">
				{title}
			</div>
			<div className="p-1">
				{children}
			</div>
		</div>
	);
}
