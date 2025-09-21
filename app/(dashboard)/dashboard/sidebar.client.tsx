'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

const items = [
	{ href: '/dashboard', label: 'Dashboard' },
	{ href: '/tasks', label: 'Tasks' },
	{ href: '/events', label: 'Events' },
];

export default function ClientSidebar() {
	const pathname = usePathname();

	return (
		<nav className="px-2 space-y-2">
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
