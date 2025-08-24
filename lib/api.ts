/* eslint-disable @typescript-eslint/explicit-function-return-type -- prisma return types are complicated */

import prisma, {
	Prisma,
	type PrismaClient,
	type TransactionClient,
} from './prisma';
import {
	compareRoles,
	type Id,
	type Priority,
	type TaskStatus,
	type WorkspaceMemberRole,
} from './types';

interface CreateUserArgs {
	email: string;
	name: string;
}

interface CreateWorkspaceArgs {
	name: string;
	owner: Id;
}
interface CreateTaskArgs {
	title: string;
	workspaceId: Id;
	description?: string;
	visibility?: WorkspaceMemberRole;
	status?: TaskStatus;
	deadline?: Date;
	priority?: Priority;
	tags?: string[];
	assignees?: Id[];
	dependencies?: Id[];
	parents?: Id[];
}

interface CreateEventArgs {
	title: string;
	workspaceId: Id;
	description?: string;
	visibility?: WorkspaceMemberRole;
	start: Date;
	end: Date;
	tags?: string[];
	attendees?: Id[];
}

export const createAPI = (prisma: PrismaClient) => {
	const checkWorkspaceMembers = async (
		prisma: TransactionClient,
		userType: string,
		workspaceId: Id,
		visibility: WorkspaceMemberRole,
		users: Id[],
	): Promise<Error[]> => {
		const members = Object.groupBy(
			await prisma.workspaceMember.findMany({
				select: {userId: true, role: true},
				where: {workspaceId, userId: {in: users}},
			}),
			x => x.userId,
		);
		return users.flatMap(id => {
			const [member] = members[id] ?? [];
			return !member
				? [
						new Error(
							`${userType} ${id} is not a member of workspace ${workspaceId}`,
						),
					]
				: compareRoles(member.role, visibility) < 0
					? [
							new Error(
								`${userType} ${id} does not have sufficient permissions (${member.role} < ${visibility})`,
							),
						]
					: [];
		});
	};

	// TODO: check dependency cycles
	const checkTaskDependencies = async (
		prisma: TransactionClient,
		workspaceId: Id,
		visibility: WorkspaceMemberRole,
		dependencies: Id[],
	): Promise<Error[]> => {
		const tasks = Object.groupBy(
			await prisma.task.findMany({
				select: {id: true, visibility: true},
				where: {workspaceId, id: {in: dependencies}},
			}),
			x => x.id,
		);
		return dependencies.flatMap(id => {
			const [dep] = tasks[id] ?? [];
			return !dep
				? [new Error(`Dependent task ${id} is not in workspace ${workspaceId}`)]
				: compareRoles(dep.visibility, visibility) < 0
					? [
							new Error(
								`Dependent task ${id} does not have sufficient visibility (${dep.visibility} < ${visibility})`,
							),
						]
					: [];
		});
	};

	const checkTaskParents = async (
		prisma: TransactionClient,
		workspaceId: Id,
		visibility: WorkspaceMemberRole,
		parents: Id[],
	): Promise<Error[]> => {
		const tasks = Object.groupBy(
			await prisma.task.findMany({
				select: {id: true, visibility: true},
				where: {workspaceId, id: {in: parents}},
			}),
			x => x.id,
		);
		return parents.flatMap(id => {
			const [par] = tasks[id] ?? [];
			return !par
				? [new Error(`Parent task ${id} is not in workspace ${workspaceId}`)]
				: compareRoles(par.visibility, visibility) > 0
					? [
							new Error(
								`Task does not have sufficient visibility for parent task ${id} (${par.visibility} > ${visibility})`,
							),
						]
					: [];
		});
	};

	const checkTask = async (
		prisma: TransactionClient,
		{
			title,
			workspaceId,
			visibility,
			assignees,
			dependencies,
			parents,
		}: {
			title: string;
			workspaceId: Id;
			visibility: WorkspaceMemberRole;
			assignees?: Id[] | undefined;
			dependencies?: Id[] | undefined;
			parents?: Id[] | undefined;
		},
	): Promise<Error[]> =>
		(
			await Promise.all([
				...(!title ? [new Error('Title must not be empty')] : []),
				...(assignees
					? [
							checkWorkspaceMembers(
								prisma,
								'Assignee',
								workspaceId,
								visibility,
								assignees,
							),
						]
					: []),
				...(dependencies
					? [
							checkTaskDependencies(
								prisma,
								workspaceId,
								visibility,
								dependencies,
							),
						]
					: []),
				...(parents
					? [checkTaskParents(prisma, workspaceId, visibility, parents)]
					: []),
			])
		).flat();

	return {
		// #region Users
		getUser: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.user.findUnique({where: {id}}),
		createUser: async (data: CreateUserArgs): Promise<Id> => {
			const {id} = await prisma.user.create({
				select: {id: true},
				data,
			});
			return id;
		},
		updateUser: async (
			id: Id,
			data: Partial<CreateUserArgs>,
		): Promise<void> => {
			await prisma.user.update({
				select: {id: true},
				where: {id},
				data,
			});
		},
		// #endregion

		// #region Workspaces

		getWorkspace: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.workspace.findUnique({where: {id}}),
		getWorkspaceMembers: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.workspace.findUnique({where: {id}, include: {members: true}}),
		getWorkspaces: async (user: Id) =>
			// TODO: only select properties that are needed
			prisma.workspace.findMany({where: {members: {some: {userId: user}}}}),
		createWorkspace: async ({
			owner,
			...rest
		}: CreateWorkspaceArgs): Promise<Id> => {
			const {id} = await prisma.workspace.create({
				select: {id: true},
				data: {owner: {connect: {id: owner}}, ...rest},
			});
			return id;
		},
		updateWorkspace: async (
			id: Id,
			{owner, ...rest}: Partial<CreateWorkspaceArgs>,
		): Promise<void> => {
			await prisma.workspace.update({
				select: {id: true},
				where: {id},
				data: {owner: {connect: {id: owner ?? Prisma.skip}}, ...rest},
			});
		},

		// #endregion

		// #region Tasks & Events

		getTask: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.task.findUnique({where: {id}}),
		getTaskWithAssigneesAndTags: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.task.findUnique({
				where: {id},
				include: {assignees: true, tags: true},
			}),

		getEvent: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.event.findUnique({where: {id}}),

		/** Sorted by deadline in ascending order */
		getTasks: async (user: Id) =>
			prisma.task.findMany({
				where: {assignees: {some: {id: user}}},
				// TODO: only select properties that are needed
				orderBy: {deadline: 'asc'},
			}),

		/** Sorted by start time and then end time in ascending order */
		getEvents: async (user: Id) =>
			prisma.event.findMany({
				where: {attendees: {some: {id: user}}},
				// TODO: only select properties that are needed
				orderBy: [{start: 'asc'}, {end: 'asc'}],
			}),

		createTask: async ({
			workspaceId,
			tags = [],
			assignees = [],
			dependencies = [],
			parents = [],
			visibility = 'MEMBER',
			title,
			...rest
		}: CreateTaskArgs): Promise<Id> =>
			prisma.$transaction(async prisma => {
				const errors = await checkTask(prisma, {
					title,
					workspaceId,
					visibility,
					assignees,
					dependencies,
					parents,
				});
				if (errors.length) throw new AggregateError(errors);

				const {id} = await prisma.task.create({
					select: {id: true},
					data: {
						workspace: {connect: {id: workspaceId}},
						tags: {
							connectOrCreate: tags.map(name => ({
								where: {name},
								create: {name},
							})),
						},
						assignees: {connect: assignees.map(id => ({id}))},
						dependencies: {connect: dependencies.map(id => ({id}))},
						parents: {connect: parents.map(id => ({id}))},
						visibility,
						title,
						...rest,
					},
				});
				return id;
			}),

		updateTask: async (
			id: Id,
			{
				tags,
				assignees,
				dependencies,
				parents,
				...rest
			}: Partial<Omit<CreateTaskArgs, 'workspaceId'>>,
		): Promise<void> =>
			prisma.$transaction(async prisma => {
				const {workspaceId, visibility} = await prisma.task.findUniqueOrThrow({
					select: {workspaceId: true, visibility: true},
					where: {id},
				});
				const errors = await checkTask(prisma, {
					workspaceId,
					visibility,
					assignees,
					dependencies,
					parents,
				});
				if (errors.length) throw new AggregateError(errors);

				await prisma.task.update({
					select: {id: true},
					where: {id},
					data: {
						tags: {set: tags?.map(name => ({name})) ?? Prisma.skip},
						assignees: {connect: assignees?.map(id => ({id})) ?? Prisma.skip},
						dependencies: {
							connect: dependencies?.map(id => ({id})) ?? Prisma.skip,
						},
						parents: {connect: parents?.map(id => ({id})) ?? Prisma.skip},
						...rest,
					},
				});
			}),

		createEvent: async ({
			workspaceId,
			tags = [],
			attendees = [],
			...rest
		}: CreateEventArgs): Promise<Id> => {
			// TODO: check attendees have access to event
			const {id} = await prisma.event.create({
				select: {id: true},
				data: {
					workspace: {connect: {id: workspaceId}},
					tags: {create: tags.map(name => ({name}))},
					attendees: {connect: attendees.map(id => ({id}))},
					...rest,
				},
			});
			return id;
		},

		updateEvent: async (
			id: Id,
			{tags, attendees, ...rest}: Partial<Omit<CreateEventArgs, 'workspaceId'>>,
		): Promise<void> => {
			// TODO: check attendees have access to event
			await prisma.event.update({
				select: {id: true},
				where: {id},
				data: {
					tags: {set: tags?.map(name => ({name})) ?? Prisma.skip},
					attendees: {connect: attendees?.map(id => ({id})) ?? Prisma.skip},
					...rest,
				},
			});
		},

		// #endregion
	};
};

export default createAPI(prisma);
