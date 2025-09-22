// TODO: remove once workspaces are implemented

import {auth0} from './auth0';
import prisma from './prisma';
import type {Id} from './types';

export const getWorkspaceId = async (): Promise<Id> =>
	(await prisma.workspace.findFirstOrThrow({select: {id: true}})).id;

export const getCurrentUser = async (): Promise<string> => {
	const session = await auth0.getSession();
	if (session === null) throw new Error('no auth0 session');
	return session.user.sub;
};
