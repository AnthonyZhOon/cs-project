import Link from 'next/link';
import api from '@/lib/api';
import {getCurrentUser} from '@/lib/util';
import type {Workspace} from '@/lib/types';

const getUserWorkspaces = async (): Promise<Workspace[]> => {
	const userId = await getCurrentUser();
	return await api.getWorkspaces(userId);
};

export default async function WorkspacesPage() {
	const workspaces = await getUserWorkspaces();

	return (
		<>
			<h2 className="text-xl font-bold mb-2">Your Workspaces</h2>
			<h3 className="text-lg mb-6">Choose a workspace to continue</h3>

			{workspaces.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-gray-600 mb-4">
						You&apos;re not part of any workspaces yet.
					</p>
					<Link
						href="/auth/createWorkspace"
						className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
					>
						Create your first workspace
					</Link>
				</div>
			) : (
				<div className="space-y-3">
					{workspaces.map(workspace => (
						<Link
							key={workspace.id}
							href={`/${workspace.id}/dashboard`}
							className="block w-full p-4 border rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
						>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-semibold text-lg text-gray-900">
										{workspace.name}
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										Click to enter workspace
									</p>
								</div>
								<div className="text-gray-400">
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</div>
						</Link>
					))}

					<div className="pt-4 border-t mt-6">
						<Link
							href="/auth/createWorkspace"
							className="block w-full text-center py-2 text-blue-600 hover:underline text-sm"
						>
							+ Create new workspace
						</Link>
					</div>
				</div>
			)}
		</>
	);
}
