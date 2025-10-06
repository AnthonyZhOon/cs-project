'use server';

import {revalidatePath} from 'next/cache';
import api from '@/lib/api';
import {getCurrentUser} from '@/lib/util';
import type {Id} from '@/lib/types';

export const acceptInvite = async (workspaceId: Id): Promise<void> => {
	const userId = await getCurrentUser();
	await api.acceptInvite(userId, workspaceId);
	revalidatePath('/workspaces');
};

export const rejectInvite = async (workspaceId: Id): Promise<void> => {
	const userId = await getCurrentUser();
	await api.rejectInvite(userId, workspaceId);
	revalidatePath('/workspaces');
};
