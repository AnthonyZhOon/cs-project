import {$Enums, type WorkspaceMemberRole} from './generated/prisma';
import type api from '@/lib/api';
import type {Priority} from './generated/prisma';

export {
	Priority,
	TaskStatus,
	WorkspaceMemberRole,
	type Event,
	type Task,
	type Tag,
	type User,
	type Workspace,
	type WorkspaceInvite,
	type WorkspaceMember,
} from './generated/prisma';

export type Id = string;
export type FullTask = Awaited<ReturnType<typeof api.getTask>>;

export const roleRank = (role: WorkspaceMemberRole): number => {
	switch (role) {
		case 'MEMBER':
			return 0;
		case 'MANAGER':
			return 1;
	}
};

export const priorityFromString = (s: string): Priority | undefined =>
	Object.keys($Enums.Priority).includes(s.toUpperCase())
		? (s.toUpperCase() as Priority)
		: undefined;

export const compareRoles = (
	x: WorkspaceMemberRole,
	y: WorkspaceMemberRole,
): number => roleRank(x) - roleRank(y);
