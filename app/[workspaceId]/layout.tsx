import api from '@/lib/api';
import ClientSidebar from './sidebar.client';
import ClientToolbar from './toolbar.client';
import type {ReactNode} from 'react';

export default async function DashboardLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{workspaceId: string}>;
}) {
	const {workspaceId} = await params;
	const {name} = (await api.getWorkspace(workspaceId)) ?? {name: 'ERROR'};
	return (
		<div className="min-h-screen flex bg-pink-50">
			{/* Sidebar */}
			<aside className="w-56 shrink-0 border-r border-pink-100 bg-white/70 backdrop-blur-sm">
				<div className="p-4 font-semibold text-pink-600">LOGO</div>
				<ClientSidebar workspaceId={workspaceId} />
			</aside>

			{/* Main */}
			<div className="flex-1 flex flex-col">
				{/* Topbar */}
				<header className="border-b border-pink-100 bg-white/70 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
					<div className="text-sm text-gray-600">
						{/* TODO: Switch between workspaces? */}
						Workspace: <strong className="text-teal-600">{name}</strong>
					</div>
					<ClientToolbar />
				</header>

				{/* Content */}
				<main className="min-h-0 p-6">{children}</main>
			</div>
		</div>
	);
}
