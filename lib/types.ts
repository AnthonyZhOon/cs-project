import type api from '@/lib/api';
import type {WorkspaceMemberRole} from './generated/prisma';

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
export type TaskWithAssigneesAndTags = Awaited<
	ReturnType<typeof api.getTaskWithAssigneesAndTags>
>;

export const roleRank = (role: WorkspaceMemberRole): number => {
	switch (role) {
		case 'MEMBER':
			return 0;
		case 'MANAGER':
			return 1;
	}
};

export const compareRoles = (
	x: WorkspaceMemberRole,
	y: WorkspaceMemberRole,
): number => roleRank(x) - roleRank(y);
