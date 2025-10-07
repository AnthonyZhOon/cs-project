'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

export default function ClientSidebar({workspaceId}: {workspaceId: string}) {
	const pathname = usePathname();

	const items = [
		{href: `/${workspaceId}/dashboard`, label: 'Dashboard'},
		{href: `/${workspaceId}/tasks`, label: 'Tasks'},
		{href: `/${workspaceId}/events`, label: 'Events'},
		{href: `/${workspaceId}/members`, label: 'Members'},
	];

	return (
		<nav className="px-2 space-y-1">
			{/* My Assignments link */}
			<div className="pt-2 pb-2 border-b mb-2">
				<Link
					href="/my-assignments"
					className="group flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50"
				>
					<span className="h-5 w-1.5 rounded-full bg-transparent group-hover:bg-gray-300" />
					<span>📋 My Assignments</span>
				</Link>
			</div>
			{items.map(it => {
				const active =
					pathname === it.href || pathname.startsWith(it.href + '/');

				return (
					<Link
						key={it.href}
						href={it.href}
						aria-current={active ? 'page' : undefined}
						className={[
							'group flex items-center gap-3 rounded-xl px-4 py-2 transition-colors',
							active
								? 'bg-pink-100 text-pink-900 font-medium'
								: 'text-gray-700 hover:bg-pink-50 hover:text-pink-800',
						].join(' ')}
					>
						<span
							className={[
								'h-5 w-1.5 rounded-full transition-colors',
								active
									? 'bg-pink-400'
									: 'bg-transparent group-hover:bg-pink-200',
							].join(' ')}
						/>
						<span className="text-sm">{it.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
