import {revalidatePath} from 'next/cache';
import Link from 'next/link';
import api from '@/lib/api';
import {getCurrentUser} from '@/lib/util';
import type {Id, Workspace, WorkspaceInvite} from '@/lib/types';

interface WorkspaceInviteWithWorkspace extends WorkspaceInvite {
	workspace: Workspace;
}

const acceptInvite = async (workspaceId: Id): Promise<void> => {
	'use server';
	const userId = await getCurrentUser();
	await api.acceptInvite(userId, workspaceId);
	revalidatePath('/workspaces');
};

const rejectInvite = async (workspaceId: Id): Promise<void> => {
	'use server';
	const userId = await getCurrentUser();
	await api.rejectInvite(userId, workspaceId);
	revalidatePath('/workspaces');
};

const getUserWorkspaces = async (): Promise<Workspace[]> => {
	const userId = await getCurrentUser();
	return await api.getWorkspaces(userId);
};

const getPendingInvites = async (): Promise<WorkspaceInviteWithWorkspace[]> => {
	const userId = await getCurrentUser();
	return await api.getPendingInvites(userId);
};

export default async function WorkspacesPage() {
	const [workspaces, pendingInvites] = await Promise.all([
		getUserWorkspaces(),
		getPendingInvites(),
	]);

	return (
		<>
			<h2 className="text-xl font-bold mb-2">Your Workspaces</h2>
			<h3 className="text-lg mb-6">Choose a workspace to continue</h3>

			{workspaces.length === 0 && pendingInvites.length === 0 ? (
				<div className="text-center py-8">
					<p className="text-gray-600 mb-4">
						You&apos;re not part of any workspaces yet.
					</p>
					<Link
						href="/workspaces/new"
						className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
					>
						Create your first workspace
					</Link>
				</div>
			) : (
				<div className="space-y-3">
					{/* Pending Invites */}
					{pendingInvites.length > 0 && (
						<>
							<h4 className="text-md font-semibold text-gray-700 mb-3">
								Pending Invitations
							</h4>
							{pendingInvites.map(invite => (
								<div
									key={invite.workspace.id}
									className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-all duration-200 shadow-sm"
								>
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-semibold text-lg text-gray-900">
												{invite.workspace.name}
											</h3>
											<p className="text-sm text-gray-600 mt-1">
												Invitation to join as {invite.memberRole.toLowerCase()}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<form
												action={acceptInvite.bind(null, invite.workspace.id)}
											>
												<button
													type="submit"
													className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full transition-colors text-green-600 font-bold text-lg leading-none"
													title="Accept invite"
												>
													✓
												</button>
											</form>
											<form
												action={rejectInvite.bind(null, invite.workspace.id)}
											>
												<button
													type="submit"
													className="flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full transition-colors text-red-600 font-bold text-lg leading-none"
													title="Reject invite"
												>
													✕
												</button>
											</form>
										</div>
									</div>
								</div>
							))}
							{workspaces.length > 0 && (
								<div className="border-t pt-4 mt-6">
									<h4 className="text-md font-semibold text-gray-700 mb-3">
										Your Workspaces
									</h4>
								</div>
							)}
						</>
					)}

					{/* Current Workspaces */}
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
								<div className="text-gray-400 text-xl font-light">›</div>
							</div>
						</Link>
					))}

					<div className="pt-4 border-t mt-6">
						<Link
							href="/workspaces/new"
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
