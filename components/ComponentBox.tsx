'use client';

export default function ComponentBox({ children, title, className = "" }: { children: React.ReactNode, title: string, className?: string }) {

	return (
		<div className={`w-full border border-black rounded-md ${className}`}>
			<div className="border-b p-1 font-bold">
				{title}
			</div>
			<div className="p-1">
				{children}
			</div>
		</div>
	);
}
