// TODO: remove once workspaces are implemented

import prisma from './prisma';
import type {Id} from './types';

export const getWorkspaceId = async (): Promise<Id> =>
	(await prisma.workspace.findFirstOrThrow({select: {id: true}})).id;

// TODO: Change once auth creates a user.
export const getCurrentUser = async (): Promise<string> =>
	// const session = await auth0.getSession();
	// if (session === null) throw new Error("?");
	// return session.user.sub;

	(await prisma.user.findFirstOrThrow({select: {id: true}})).id;
