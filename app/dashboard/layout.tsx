import Link from 'next/link';
import ClientSidebar from './sidebar.client';
import type {ReactNode} from 'react';

export default function DashboardLayout({children}: {children: ReactNode}) {
	return (
		<div className="min-h-screen flex">
			{/* Sidebar */}
			<aside className="w-56 shrink-0 border-r bg-white">
				<div className="p-4 font-semibold">LOGO</div>
				<ClientSidebar />
			</aside>

			{/* Main */}
			<div className="flex-1 flex flex-col">
				{/* Topbar */}
				<header className="border-b px-6 py-3 flex items-center justify-between">
					<div className="text-sm text-gray-600">
						Workspace: <strong>Default</strong>
					</div>

					<div className="flex items-center gap-3">
	
						<Link
							href="/profile"
							aria-label="Profile"
							className="p-2 rounded-lg border hover:bg-gray-50"
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
				<main className="min-h-0">{children}</main>
			</div>
		</div>
	);
}
