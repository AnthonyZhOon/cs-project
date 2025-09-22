'use server';

import {redirect} from 'next/navigation';
import api from '@/lib/api';
import {getCurrentUser} from '@/lib/util';

export const createWorkspaceAction = async (
	formData: FormData,
): Promise<void> => {
	const user = await getCurrentUser();

	const workspaceName = formData.get('workspace') as string;

	const workspaceId = await api.createWorkspace({
		name: workspaceName.trim(),
		owner: user,
	});

	// Redirect to the new workspace
	redirect(`/${workspaceId}/dashboard`);
};
