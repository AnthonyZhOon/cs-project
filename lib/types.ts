import type {WorkspaceMemberRole} from './generated/prisma';

export type {
	Event,
	Priority,
	Task,
	TaskStatus,
	User,
	Workspace,
	WorkspaceInvite,
	WorkspaceMember,
	WorkspaceMemberRole,
} from './generated/prisma';

export type Id = string;

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
