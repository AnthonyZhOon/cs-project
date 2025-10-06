import MissingAuthError from '@/components/MissingAuthError';
import api from '@/lib/api';
import {getCurrentUser} from '@/lib/util';
import {InviteForm} from './invite-form.client';
import {InvitesList, MembersList} from './members-list.client';

export default async function MembersPage({
	params,
}: {
	params: Promise<{workspaceId: string}>;
}) {
	const {workspaceId} = await params;
	const userId = await getCurrentUser();

	const [workspaceData, invites, currentUserRole] = await Promise.all([
		api.getWorkspaceMembersWithRoles(workspaceId),
		api.getWorkspaceInvites(workspaceId),
		api.getUserWorkspaceRole(workspaceId, userId),
	]);

	if (!currentUserRole) return <MissingAuthError />;

	const isManager = currentUserRole === 'MANAGER';

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900">Workspace Members</h1>
				<p className="text-gray-600 mt-2">
					Manage members and invitations for your workspace
				</p>
			</div>

			{/* Current Members */}
			<div className="bg-white rounded-lg shadow-sm border mb-6">
				<div className="px-6 py-4 border-b">
					<h2 className="text-xl font-semibold text-gray-900">
						Current Members ({workspaceData.members.length})
					</h2>
				</div>
				<MembersList
					members={workspaceData.members}
					workspaceId={workspaceId}
					ownerId={workspaceData.ownerId}
					currentUserId={userId}
					isManager={isManager}
				/>
			</div>

			{/* Pending Invites */}
			{isManager && (
				<div className="bg-white rounded-lg shadow-sm border mb-6">
					<div className="px-6 py-4 border-b">
						<h2 className="text-xl font-semibold text-gray-900">
							Pending Invitations ({invites.length})
						</h2>
					</div>
					<InvitesList invites={invites} workspaceId={workspaceId} />
				</div>
			)}

			{/* Invite New Members */}
			{isManager && (
				<div className="bg-white rounded-lg shadow-sm border">
					<div className="px-6 py-4 border-b">
						<h2 className="text-xl font-semibold text-gray-900">
							Invite New Members
						</h2>
					</div>
					<div className="px-6 py-4">
						<InviteForm workspaceId={workspaceId} />
						<p className="mt-2 text-sm text-gray-600">
							Invited users will receive an invitation when they sign in
						</p>
					</div>
				</div>
			)}

			{/* Non-manager message */}
			{!isManager && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<p className="text-blue-800">
						Only managers can invite or manage workspace members.
					</p>
				</div>
			)}
		</div>
	);
}
