/* eslint-disable @typescript-eslint/explicit-function-return-type -- prisma return types are complicated */

import prisma, {type PrismaClient, type TransactionClient} from './prisma';
import {
	WorkspaceMemberRole,
	compareRoles,
	type Id,
	type Priority,
	type TaskStatus,
	type User,
} from './types';

interface CreateUserArgs {
	id: Id;
	email: string;
	name: string;
}

interface CreateWorkspaceArgs {
	name: string;
	owner: Id;
	members?: {userId: Id; role: WorkspaceMemberRole}[];
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

	const checkTaskDependencies = async (
		prisma: TransactionClient,
		taskId: Id | undefined,
		workspaceId: Id,
		visibility: WorkspaceMemberRole,
		dependencyIds: Id[],
	): Promise<Error[]> => {
		const dependencies = Object.fromEntries(
			Object.entries(
				Object.groupBy(
					await prisma.task.findMany({
						select: {
							id: true,
							title: true,
							visibility: true,
							dependencies: {select: {id: true}},
						},
						where: {workspaceId, id: {in: dependencyIds}},
					}),
					x => x.id,
				),
			).map(([k, v]) => [k, v![0]!]),
		);
		const errors = dependencyIds.flatMap(id => {
			const dep = dependencies[id];
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
		if (errors.length) return errors;

		const tasks: Record<
			Id,
			Omit<(typeof dependencies)[number], 'title' | 'visibility'>
		> = {...dependencies};
		// Check for cycles
		const check = async (
			{id, dependencies}: (typeof tasks)[number],
			originalDependency: string,
			seen: Set<Id>,
		): Promise<Error[]> => {
			if (seen.has(id)) {
				return [
					new Error(
						`Dependency cycle detected at task ‘${originalDependency}’`,
					),
				];
			}

			(
				await prisma.task.findMany({
					select: {
						id: true,
						dependencies: {select: {id: true}},
					},
					where: {
						id: {
							in: dependencies.map(t => t.id).filter(id => !(id in tasks)),
						},
					},
				})
			).forEach(t => (tasks[t.id] = t));
			return (
				await Promise.all(
					dependencies.map(async t =>
						check(tasks[t.id]!, originalDependency, new Set([...seen, id])),
					),
				)
			).flat();
		};
		return (
			await Promise.all(
				dependencyIds.map(async id =>
					check(
						tasks[id]!,
						dependencies[id]!.title,
						new Set(taskId === undefined ? undefined : [taskId]),
					),
				),
			)
		).flat();
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
			id,
			title,
			workspaceId,
			visibility,
			assignees,
			dependencies,
			parents,
		}: {
			id?: Id | undefined;
			title?: string | undefined;
			workspaceId: Id;
			visibility: WorkspaceMemberRole;
			assignees?: Id[] | undefined;
			dependencies?: Id[] | undefined;
			parents?: Id[] | undefined;
		},
	): Promise<Error[]> =>
		(
			await Promise.all([
				...(title !== undefined && !title
					? [new Error('Title must not be empty')]
					: []),
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
								id,
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
		login: async ({id, email, name}: CreateUserArgs): Promise<void> => {
			await prisma.user.upsert({
				select: {id: true},
				where: {id},
				create: {id, email, name},
				update: {name},
			});
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
			// Include member.user so callers can access user names without extra queries
			(
				await prisma.workspace.findUniqueOrThrow({
					where: {id},
					include: {
						members: {include: {user: {select: {id: true, name: true}}}},
					},
				})
			).members.map(({user}) => user),

		getWorkspaceMembersWithRoles: async (id: Id) =>
			// Get members with their roles for management
			await prisma.workspace.findUniqueOrThrow({
				where: {id},
				include: {
					owner: {select: {id: true}},
					members: {
						include: {user: {select: {id: true, name: true, email: true}}},
					},
				},
			}),

		getUserWorkspaceRole: async (workspaceId: Id, userId: Id) => {
			const member = await prisma.workspaceMember.findUnique({
				where: {userId_workspaceId: {userId, workspaceId}},
				select: {role: true},
			});
			return member?.role;
		},

		updateMemberRole: async (
			workspaceId: Id,
			userId: Id,
			role: WorkspaceMemberRole,
		): Promise<void> => {
			await prisma.workspaceMember.update({
				where: {userId_workspaceId: {userId, workspaceId}},
				data: {role},
			});
		},

		removeMember: async (workspaceId: Id, userId: Id): Promise<void> => {
			await prisma.workspaceMember.delete({
				where: {userId_workspaceId: {userId, workspaceId}},
			});
		},

		getWorkspaceInvites: async (workspaceId: Id) =>
			prisma.workspaceInvite.findMany({
				where: {workspaceId},
				select: {email: true, memberRole: true},
			}),
		removeWorkspaceInvite: async (
			workspaceId: Id,
			email: string,
		): Promise<void> => {
			await prisma.workspaceInvite.delete({
				where: {email_workspaceId: {email, workspaceId}},
			});
		},

		getWorkspaces: async (user: Id) =>
			// TODO: only select properties that are needed
			prisma.workspace.findMany({
				where: {members: {some: {userId: user}}},
			}),
		createWorkspace: async ({
			owner,
			members = [],
			...rest
		}: CreateWorkspaceArgs): Promise<Id> => {
			const {id} = await prisma.workspace.create({
				select: {id: true},
				data: {
					owner: {connect: {id: owner}},
					members: {
						createMany: {data: [{userId: owner, role: 'MANAGER'}, ...members]},
					},
					...rest,
				},
			});
			return id;
		},

		// TODO
		// Maybe separate:
		// - set member role
		// - Remove member.
		// - Change owner.

		// It's ambiguous whether a member not appearing in the list means
		// to remove them or to leave them not updated
		// Gonna comment out for now since it is not used.

		// updateWorkspace: async (
		// 	id: Id,
		// 	{owner, members = [], ...rest}: Partial<CreateWorkspaceArgs>,
		// ): Promise<void> => {
		// 	await prisma.workspace.update({
		// 		select: {id: true},
		// 		where: {id},
		// 		data: {owner: {connect: {id: owner ?? Prisma.skip}},
		// 			members: {
		// 				createMany: {data: [{userId: owner, role: 'MANAGER'}, ...members]},
		// 			},
		// 			...rest,
		// 	});
		// },

		createWorkspaceInvites: async (
			workspaceId: Id,
			invites: {email: string; memberRole: WorkspaceMemberRole}[],
		): Promise<void> => {
			if (invites.length === 0) return;

			await prisma.workspaceInvite.createMany({
				data: invites.map(invite => ({
					...invite,
					workspaceId,
				})),
				skipDuplicates: true,
			});
		},

		getPendingInvites: async (userId: Id) => {
			const user = await prisma.user.findUniqueOrThrow({
				where: {id: userId},
				select: {email: true},
			});
			return prisma.workspaceInvite.findMany({
				where: {email: user.email},
				include: {workspace: true},
			});
		},

		acceptInvite: async (userId: Id, workspaceId: Id): Promise<void> => {
			await prisma.$transaction(async prisma => {
				const email = (
					await prisma.user.findUniqueOrThrow({
						where: {id: userId},
						select: {email: true},
					})
				).email;
				const invite = await prisma.workspaceInvite.findUniqueOrThrow({
					where: {email_workspaceId: {email, workspaceId}},
				});
				await prisma.workspaceMember.create({
					data: {
						userId,
						workspaceId,
						role: invite.memberRole,
					},
				});
				await prisma.workspaceInvite.delete({
					where: {email_workspaceId: {email, workspaceId}},
				});
			});
		},

		rejectInvite: async (userId: Id, workspaceId: Id): Promise<void> => {
			const email = (
				await prisma.user.findUniqueOrThrow({
					where: {id: userId},
					select: {email: true},
				})
			).email;
			await prisma.workspaceInvite.delete({
				where: {email_workspaceId: {email, workspaceId}},
			});
		},

		// #endregion

		// #region Tasks & Events

		getTask: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.task.findUnique({
				where: {id},
				include: {assignees: true, tags: true, dependencies: true},
			}),

		getEvent: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.event.findUnique({where: {id}}),
		getEventWithAttendeesAndTags: async (id: Id) =>
			// TODO: only select properties that are needed
			prisma.event.findUnique({
				where: {id},
				include: {attendees: true, tags: true},
			}),

		/** Sorted by deadline in ascending order */
		getTasks: async ({
			workspaceId,
			priority,
			tag,
			assigneeId,
		}: {
			workspaceId: Id;
			priority?: Priority | undefined;
			tag?: string | undefined;
			assigneeId?: string | undefined;
		}) =>
			prisma.task.findMany({
				where: {
					workspaceId,
					...(priority ? {priority} : {}),
					...(tag !== undefined && tag !== ''
						? {tags: {some: {name: tag}}}
						: {}),
					...(assigneeId !== undefined && assigneeId !== ''
						? {assignees: {some: {id: assigneeId}}}
						: {}),
				},
				include: {assignees: true, tags: true, dependencies: true},
				orderBy: {deadline: 'asc'},
			}),

		/** Sorted by start time and then end time in ascending order */
		getEvents: async ({
			workspaceId,
			tag,
			attendeeId,
		}: {
			workspaceId: Id;
			tag?: string | undefined;
			attendeeId?: string | undefined;
		}) =>
			prisma.event.findMany({
				where: {
					workspaceId,
					...(tag !== undefined && tag !== ''
						? {tags: {some: {name: tag}}}
						: {}),
					...(attendeeId !== undefined && attendeeId !== ''
						? {attendees: {some: {id: attendeeId}}}
						: {}),
				},
				include: {attendees: true, tags: true},
				orderBy: [{start: 'asc'}, {end: 'asc'}],
			}),

		/** Sorted in ascending order; requires workspace scope. */
		getTags: async (workspaceId: Id) =>
			(
				await prisma.tag.findMany({
					where: {workspaceId},
					select: {name: true},
					orderBy: {name: 'asc'},
				})
			).map(t => t.name),

		getAvailableMembers: async (
			workspaceId: Id,
			visibility: WorkspaceMemberRole = WorkspaceMemberRole.MEMBER,
		): Promise<Pick<User, 'id' | 'name'>[]> =>
			(
				await prisma.workspaceMember.findMany({
					select: {userId: true, user: {select: {name: true}}},
					where: {
						workspaceId,
						role: {
							in: [
								WorkspaceMemberRole.MANAGER,
								...(visibility === WorkspaceMemberRole.MEMBER
									? [WorkspaceMemberRole.MEMBER]
									: []),
							],
						},
					},
				})
			).map(m => ({id: m.userId, name: m.user.name})),

		getAvailableTaskDependencies: async (
			workspaceId: Id,
			visibility: WorkspaceMemberRole = WorkspaceMemberRole.MEMBER,
		) =>
			prisma.task.findMany({
				select: {id: true, title: true},
				where: {
					workspaceId,
					visibility: {
						in: [
							WorkspaceMemberRole.MANAGER,
							...(visibility === WorkspaceMemberRole.MEMBER
								? [WorkspaceMemberRole.MEMBER]
								: []),
						],
					},
				},
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
								where: {workspaceId_name: {workspaceId, name}},
								create: {workspaceId, name},
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
				title,
				...rest
			}: Partial<Omit<CreateTaskArgs, 'workspaceId'>>,
		): Promise<void> =>
			prisma.$transaction(async prisma => {
				const {workspaceId, visibility} = await prisma.task.findUniqueOrThrow({
					select: {workspaceId: true, visibility: true},
					where: {id},
				});
				const errors = await checkTask(prisma, {
					id,
					title,
					workspaceId,
					visibility,
					assignees,
					dependencies,
					parents,
				});
				if (errors.length) throw new AggregateError(errors);

				// Not sure why but the prisma skip thing was causing an error.
				// assignees: {connect: assignees?.map(id => ({id})) ?? Prisma.skip},
				await prisma.task.update({
					select: {id: true},
					where: {id},
					data: {
						tags: {
							set: [], // Reset tags
							connectOrCreate:
								tags?.map(name => ({
									where: {workspaceId_name: {workspaceId, name}},
									create: {workspaceId, name},
								})) ?? [],
						},
						// When assignees is provided, replace the full set
						...(assignees !== undefined
							? {assignees: {set: [], connect: assignees.map(id => ({id}))}}
							: {}),
						...(dependencies
							? {dependencies: {connect: dependencies.map(id => ({id}))}}
							: {}),
						...(parents ? {parents: {connect: parents.map(id => ({id}))}} : {}),
						...(title !== undefined ? {title} : {}),
						...rest,
					},
				});
			}),

		deleteTask: async (id: Id): Promise<void> => {
			await prisma.task.delete({
				where: {id},
			});
		},

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
					tags: {
						connectOrCreate: tags.map(name => ({
							where: {workspaceId_name: {workspaceId, name}},
							create: {workspaceId, name},
						})),
					},
					attendees: {connect: attendees.map(id => ({id}))},
					...rest,
				},
			});
			return id;
		},

		updateEvent: async (
			id: Id,
			{tags, attendees, ...rest}: Partial<Omit<CreateEventArgs, 'workspaceId'>>,
		): Promise<void> =>
			prisma.$transaction(async prisma => {
				// TODO: check attendees have access to event
				const {workspaceId} = await prisma.event.findUniqueOrThrow({
					select: {workspaceId: true},
					where: {id},
				});
				await prisma.event.update({
					select: {id: true},
					where: {id},
					data: {
						tags: {
							set: [],
							connectOrCreate:
								tags?.map(name => ({
									where: {workspaceId_name: {workspaceId, name}},
									create: {workspaceId, name},
								})) ?? [],
						},
						// When attendees is provided, replace full set
						...(attendees !== undefined
							? {attendees: {set: [], connect: attendees.map(id => ({id}))}}
							: {}),
						...rest,
					},
				});
			}),

		deleteEvent: async (id: Id): Promise<void> => {
			await prisma.event.delete({
				where: {id},
			});
		},

		// #endregion

		// #region Helpers

		// #endregion
	};
};

export default createAPI(prisma);
