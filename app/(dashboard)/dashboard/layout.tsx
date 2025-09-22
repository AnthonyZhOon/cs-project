import Link from 'next/link';
import {ReactNode} from 'react';
import ClientSidebar from './sidebar.client';

export default function DashboardLayout({children}: {children: ReactNode}) {
	return (
		<div className="min-h-screen flex bg-pink-50">
			{/* Sidebar */}
			<aside className="w-56 shrink-0 border-r border-pink-100 bg-white/70 backdrop-blur-sm">
				<div className="p-4 font-semibold text-pink-600">LOGO</div>
				<ClientSidebar />
			</aside>

			{/* Main */}
			<div className="flex-1 flex flex-col">
				{/* Topbar */}
				<header className="border-b border-pink-100 bg-white/70 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
					<div className="text-sm text-gray-600">
						Workspace: <strong className="text-teal-600">Default</strong>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/messages"
							aria-label="Messages"
							className="p-2 rounded-lg border border-teal-100 text-teal-600 hover:bg-teal-50 transition-colors"
						>
							{/* envelope icon */}
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								aria-hidden
							>
								<path
									d="M4 6h16v12H4z"
									stroke="currentColor"
									strokeWidth="1.5"
								/>
								<path
									d="m4 7 8 6 8-6"
									stroke="currentColor"
									strokeWidth="1.5"
									fill="none"
								/>
							</svg>
						</Link>
						<Link
							href="/profile"
							aria-label="Profile"
							className="p-2 rounded-lg border border-pink-100 text-pink-600 hover:bg-pink-50 transition-colors"
						>
							{/* user icon */}
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								aria-hidden
							>
								<circle
									cx="12"
									cy="8"
									r="4"
									stroke="currentColor"
									strokeWidth="1.5"
								/>
								<path
									d="M4 20c0-4 4-6 8-6s8 2 8 6"
									stroke="currentColor"
									strokeWidth="1.5"
									fill="none"
								/>
							</svg>
						</Link>
					</div>
				</header>

				{/* Content */}
				<main className="min-h-0 p-6">{children}</main>
			</div>
		</div>
	);
}
