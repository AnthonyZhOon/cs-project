'use client';

import {useTransition} from 'react';
import {removeInvite, removeMember, updateMemberRole} from './actions';

interface Member {
	userId: string;
	role: 'MEMBER' | 'MANAGER';
	user: {
		name: string;
		email: string;
	};
}

interface Invite {
	email: string;
	memberRole: 'MEMBER' | 'MANAGER';
}

export const MembersList = ({
	members,
	workspaceId,
	ownerId,
	currentUserId,
	isManager,
}: {
	members: Member[];
	workspaceId: string;
	ownerId: string;
	currentUserId: string;
	isManager: boolean;
}) => {
	const [isPending, startTransition] = useTransition();

	const handleRoleChange = (userId: string, newRole: 'MEMBER' | 'MANAGER') => {
		startTransition(async () => {
			await updateMemberRole(workspaceId, userId, newRole);
		});
	};

	const handleRemoveMember = (userId: string, userName: string) => {
		if (confirm(`Are you sure you want to remove ${userName}?`)) {
			startTransition(async () => {
				await removeMember(workspaceId, userId);
			});
		}
	};

	return (
		<div className="divide-y">
			{members.map(member => {
				const isMemberOwner = member.userId === ownerId;
				const isCurrentUser = member.userId === currentUserId;

				return (
					<div
						key={member.userId}
						className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
					>
						<div className="flex-1">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
									{member.user.name.charAt(0).toUpperCase()}
								</div>
								<div>
									<div className="flex items-center gap-2">
										<h3 className="font-semibold text-gray-900">
											{member.user.name}
											{isCurrentUser && (
												<span className="text-sm text-gray-500 ml-2">
													(You)
												</span>
											)}
										</h3>
										{isMemberOwner && (
											<span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
												Owner
											</span>
										)}
									</div>
									<p className="text-sm text-gray-600">{member.user.email}</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-3">
							{/* Role selector - only for managers, and can't change owner */}
							{isManager && !isMemberOwner ? (
								<select
									value={member.role}
									onChange={e =>
										handleRoleChange(
											member.userId,
											e.target.value as 'MEMBER' | 'MANAGER',
										)
									}
									disabled={isPending}
									className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
								>
									<option value="MEMBER">Member</option>
									<option value="MANAGER">Manager</option>
								</select>
							) : (
								<span
									className={`px-3 py-1.5 rounded-md text-sm font-medium ${
										member.role === 'MANAGER'
											? 'bg-purple-100 text-purple-800'
											: 'bg-gray-100 text-gray-800'
									}`}
								>
									{member.role === 'MANAGER' ? 'Manager' : 'Member'}
								</span>
							)}

							{/* Remove button - only for managers, can't remove owner or self */}
							{isManager && !isMemberOwner && !isCurrentUser && (
								<button
									type="button"
									onClick={() =>
										handleRemoveMember(member.userId, member.user.name)
									}
									disabled={isPending}
									className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
								>
									Remove
								</button>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const InvitesList = ({
	invites,
	workspaceId,
}: {
	invites: Invite[];
	workspaceId: string;
}) => {
	const [isPending, startTransition] = useTransition();

	const handleRemoveInvite = (email: string) => {
		if (
			confirm(`Are you sure you want to cancel the invitation for ${email}?`)
		) {
			startTransition(async () => {
				await removeInvite(workspaceId, email);
			});
		}
	};

	if (invites.length === 0) {
		return (
			<div className="px-6 py-8 text-center text-gray-500">
				No pending invitations
			</div>
		);
	}

	return (
		<div className="divide-y">
			{invites.map(invite => (
				<div
					key={invite.email}
					className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
				>
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
								{invite.email.charAt(0).toUpperCase()}
							</div>
							<div>
								<h3 className="font-semibold text-gray-900">{invite.email}</h3>
								<p className="text-sm text-gray-600">
									Invited as {invite.memberRole.toLowerCase()}
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span
							className={`px-3 py-1.5 rounded-md text-sm font-medium ${
								invite.memberRole === 'MANAGER'
									? 'bg-purple-100 text-purple-800'
									: 'bg-gray-100 text-gray-800'
							}`}
						>
							{invite.memberRole === 'MANAGER' ? 'Manager' : 'Member'}
						</span>

						<button
							type="button"
							onClick={() => handleRemoveInvite(invite.email)}
							disabled={isPending}
							className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
						>
							Cancel
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
