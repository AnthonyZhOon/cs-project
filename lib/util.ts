// TODO: remove once workspaces are implemented

import prisma from './prisma';
import type {Id} from './types';

export const getWorkspaceId = async (): Promise<Id> =>
	(await prisma.workspace.findFirstOrThrow({select: {id: true}})).id;
