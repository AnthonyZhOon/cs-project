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
		<div className="min-h-screen flex">
			{/* Sidebar */}
			<aside className="w-56 shrink-0 border-r bg-white">
				<div className="p-4 font-semibold">LOGO</div>
				<ClientSidebar workspaceId={workspaceId} />
			</aside>

			{/* Main */}
			<div className="flex-1 flex flex-col">
				{/* Topbar */}
				<header className="border-b px-6 py-3 flex items-center justify-between">
					<div className="text-sm text-gray-600">
						{/* TODO: Switch between workspaces? */}
						Workspace: <strong>{name}</strong>
					</div>
					<ClientToolbar />
				</header>

				{/* Content */}
				<main className="min-h-0">{children}</main>
			</div>
		</div>
	);
}
