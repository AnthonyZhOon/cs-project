'use server';

import {redirect} from 'next/navigation';
import api from '@/lib/api';
import {getCurrentUser} from '@/lib/util';
import type {WorkspaceMemberRole} from '@/lib/types';

export const createWorkspaceAction = async (
	formData: FormData,
): Promise<void> => {
	const user = await getCurrentUser();

	const workspaceName = formData.get('workspace') as string;

	// Parse members data from form
	const membersCount = parseInt(
		(formData.get('members-count') as string) || '0',
	);
	const invites: {email: string; memberRole: WorkspaceMemberRole}[] = [];

	for (let i = 0; i < membersCount; i++) {
		const email = (formData.get(`member-${i}-email`) as string).trim();
		const role = formData.get(`member-${i}-role`) as WorkspaceMemberRole;

		// Only create invites for non-empty emails
		if (email) {
			invites.push({
				email,
				memberRole: role,
			});
		}
	}

	const workspaceId = await api.createWorkspace({
		name: workspaceName.trim(),
		owner: user,
	});

	// Create invitations for all provided emails
	if (invites.length > 0)
		await api.createWorkspaceInvites(workspaceId, invites);

	// Redirect to the new workspace
	redirect(`/${workspaceId}/dashboard`);
};
