import prisma from './prisma';
import type {
	Event,
	Id,
	Priority,
	Task,
	TaskStatus,
	Workspace,
	WorkspaceMemberRole,
} from './types';

// #region Users

type CreateUserArgs = Readonly<{email: string; name: string}>;

export const createUser = async (data: CreateUserArgs): Promise<Id> => {
	const {id} = await prisma.user.create({
		select: {id: true},
		data,
	});
	return id;
};

export const updateUser = async (
	id: Id,
	data: Partial<CreateUserArgs>,
): Promise<void> => {
	await prisma.user.update({
		select: {id: true},
		where: {id},
		data,
	});
};

// #endregion

// #region Workspaces

export const getWorkspaces = (user: Id): Promise<Workspace[]> =>
	// TODO: only select properties that are needed
	prisma.workspace.findMany({where: {members: {some: {userId: user}}}});

type CreateWorkspaceArgs = Readonly<{name: string; owner: Id}>;

export const createWorkspace = async ({
	owner,
	...rest
}: CreateWorkspaceArgs): Promise<Id> => {
	const {id} = await prisma.workspace.create({
		select: {id: true},
		data: {owner: {connect: {id: owner}}, ...rest},
	});
	return id;
};

export const updateWorkspace = async (
	id: Id,
	{owner, ...rest}: Partial<CreateWorkspaceArgs>,
): Promise<void> => {
	await prisma.workspace.update({
		select: {id: true},
		where: {id},
		data: {owner: {connect: {id: owner}}, ...rest},
	});
};

// #endregion

// #region Tasks & Events

/** Sorted by deadline in ascending order */
export const getTasks = (user: Id): Promise<Task[]> =>
	prisma.task.findMany({
		where: {assignees: {some: {id: user}}},
		// TODO: only select properties that are needed
		orderBy: {deadline: 'asc'},
	});

/** Sorted by start time and then end time in ascending order */
export const getEvents = (user: Id): Promise<Event[]> =>
	prisma.event.findMany({
		where: {attendees: {some: {id: user}}},
		// TODO: only select properties that are needed
		orderBy: [{start: 'asc'}, {end: 'asc'}],
	});

type CreateTaskArgs = Readonly<{
	title: string;
	workspaceId: Id;
	description?: string;
	visibility?: WorkspaceMemberRole;
	status?: TaskStatus;
	deadline?: Date;
	priority?: Priority;
	tags?: readonly string[];
	assignees?: readonly Id[];
	dependencies?: readonly Id[];
	parents?: readonly Id[];
}>;

export const createTask = async ({
	workspaceId,
	tags = [],
	assignees = [],
	dependencies = [],
	parents = [],
	...rest
}: CreateTaskArgs): Promise<Id> => {
	// TODO: check assignees have access to task
	const {id} = await prisma.task.create({
		select: {id: true},
		data: {
			workspace: {connect: {id: workspaceId}},
			tags: {create: tags.map(name => ({name}))},
			assignees: {connect: assignees.map(id => ({id}))},
			dependencies: {connect: dependencies.map(id => ({id}))},
			parents: {connect: parents.map(id => ({id}))},
			...rest,
		},
	});
	return id;
};

type CreateEventArgs = Readonly<{
	title: string;
	workspaceId: Id;
	description?: string;
	visibility?: WorkspaceMemberRole;
	start: Date;
	end: Date;
	tags?: readonly string[];
	attendees?: readonly Id[];
}>;

export const createEvent = async ({
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
};

export const updateTask = async (
	id: Id,
	{
		workspaceId,
		tags,
		assignees,
		dependencies,
		parents,
		...rest
	}: Partial<CreateTaskArgs>,
): Promise<void> => {
	// TODO: check assignees have access to task
	await prisma.task.update({
		select: {id: true},
		where: {id},
		data: {
			workspace: {connect: {id: workspaceId}},
			tags: {set: tags?.map(name => ({name}))},
			assignees: {connect: assignees?.map(id => ({id}))},
			dependencies: {connect: dependencies?.map(id => ({id}))},
			parents: {connect: parents?.map(id => ({id}))},
			...rest,
		},
	});
};

export const updateEvent = async (
	id: Id,
	{workspaceId, tags, attendees, ...rest}: Partial<CreateEventArgs>,
): Promise<void> => {
	// TODO: check attendees have access to event
	await prisma.event.update({
		select: {id: true},
		where: {id},
		data: {
			workspace: {connect: {id: workspaceId}},
			tags: {set: tags?.map(name => ({name}))},
			attendees: {connect: attendees?.map(id => ({id}))},
			...rest,
		},
	});
};

// #endregion
