'use client';

import {useUser} from '@auth0/nextjs-auth0';
import Link from 'next/link';

export default function ClientToolbar() {
	'use client';
	const {user, isLoading} = useUser();
	return (
		<div className="flex items-center gap-3">
			<p className="text-sm text-gray-600">
				{user && !isLoading ? <strong>{user.name}</strong> : 'Loading user...'}
			</p>
			<Link
				href="/workspaces"
				className="px-3 py-2 rounded-lg border border-pink-100 text-pink-600 hover:bg-pink-50 transition-colors"
			>
				View workspaces
			</Link>
			{/* TODO: A profile page was not made a requirement */}
			{/* <Link */}
			{/* 	href="/profile" */}
			{/* 	aria-label="Profile" */}
			{/* 	className="p-2 rounded-lg border hover:bg-gray-50" */}
			{/* > */}
			{/* user icon */}
			{/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden> */}
			{/*   <circle */}
			{/*     cx="12" */}
			{/*     cy="8" */}
			{/*     r="4" */}
			{/*     stroke="currentColor" */}
			{/*     strokeWidth="1.5" */}
			{/*   /> */}
			{/*   <path */}
			{/*     d="M4 20c0-4 4-6 8-6s8 2 8 6" */}
			{/*     stroke="currentColor" */}
			{/*     strokeWidth="1.5" */}
			{/*     fill="none" */}
			{/*   /> */}
			{/* </svg> */}
			{/* </Link> */}
			{/*Logout button*/}
			{user && !isLoading ? (
				<Link
					href="/auth/logout"
					aria-label="Logout"
					className="p-2 rounded-lg border border-pink-100 text-pink-600 hover:bg-pink-50 transition-colors"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16,17 21,12 16,7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
				</Link>
			) : null}
		</div>
	);
}
