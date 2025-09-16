'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

export default function ClientSidebar({workspaceId}: {workspaceId: string}) {
	const pathname = usePathname();

	const items = [
		{href: `/${workspaceId}/dashboard`, label: 'Dashboard'},
		{href: `/${workspaceId}/tasks`, label: 'Tasks'},
		{href: `/${workspaceId}/events`, label: 'Events'},
	];

	return (
		<nav className="px-2 space-y-1">
			{items.map(it => {
				const active =
					pathname === it.href || pathname.startsWith(it.href + '/');

				return (
					<Link
						key={it.href}
						href={it.href}
						aria-current={active ? 'page' : undefined}
						className={[
							'group flex items-center gap-3 rounded-lg px-3 py-2',
							active
								? 'bg-gray-100 text-gray-900 font-semibold'
								: 'text-gray-600 hover:bg-gray-50',
						].join(' ')}
					>
						<span
							className={[
								'h-5 w-1.5 rounded-full',
								active ? 'bg-black' : 'bg-transparent group-hover:bg-gray-300',
							].join(' ')}
						/>
						<span>{it.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
