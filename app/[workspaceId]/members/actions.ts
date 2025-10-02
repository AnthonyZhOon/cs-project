'use server';

import {revalidatePath} from 'next/cache';
import api from '@/lib/api';
import {getCurrentUser} from '@/lib/util';
import type {Id, WorkspaceMemberRole} from '@/lib/types';

export const updateMemberRole = async (
	workspaceId: Id,
	userId: Id,
	role: WorkspaceMemberRole,
): Promise<void> => {
	const currentUserId = await getCurrentUser();
	const currentUserRole = await api.getUserWorkspaceRole(
		workspaceId,
		currentUserId,
	);

	// Only managers can update roles
	if (currentUserRole !== 'MANAGER')
		throw new Error('Only managers can update member roles');

	await api.updateMemberRole(workspaceId, userId, role);
	revalidatePath(`/${workspaceId}/members`);
};

export const removeMember = async (
	workspaceId: Id,
	userId: Id,
): Promise<void> => {
	const currentUserId = await getCurrentUser();
	const currentUserRole = await api.getUserWorkspaceRole(
		workspaceId,
		currentUserId,
	);

	// Only managers can remove members
	if (currentUserRole !== 'MANAGER')
		throw new Error('Only managers can remove members');

	// Get workspace details to check if removing the owner
	const workspace = await api.getWorkspace(workspaceId);
	if (workspace?.ownerId === userId)
		throw new Error('Cannot remove the workspace owner');

	await api.removeMember(workspaceId, userId);
	revalidatePath(`/${workspaceId}/members`);
};

export const inviteMembers = async (
	workspaceId: Id,
	invites: {email: string; memberRole: WorkspaceMemberRole}[],
): Promise<void> => {
	const currentUserId = await getCurrentUser();
	const currentUserRole = await api.getUserWorkspaceRole(
		workspaceId,
		currentUserId,
	);

	// Only managers can invite members
	if (currentUserRole !== 'MANAGER')
		throw new Error('Only managers can invite members');

	await api.createWorkspaceInvites(workspaceId, invites);
	revalidatePath(`/${workspaceId}/members`);
};

export const removeInvite = async (
	workspaceId: Id,
	email: string,
): Promise<void> => {
	const currentUserId = await getCurrentUser();
	const currentUserRole = await api.getUserWorkspaceRole(
		workspaceId,
		currentUserId,
	);

	// Only managers can remove invites
	if (currentUserRole !== 'MANAGER')
		throw new Error('Only managers can remove invites');

	await api.removeWorkspaceInvite(workspaceId, email);
	revalidatePath(`/${workspaceId}/members`);
};
