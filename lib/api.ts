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

/* Sorted by deadline in ascending order */
export const getTasks = (user: Id): Promise<Task[]> =>
	prisma.task.findMany({
		where: {assignees: {some: {id: user}}},
		// TODO: only select properties that are needed
		orderBy: {deadline: 'asc'},
	});

/* Sorted by start time and then end time in ascending order */
export const getEvents = (user: Id): Promise<Event[]> =>
	prisma.event.findMany({
		where: {attendees: {some: {id: user}}},
		// TODO: only select properties that are needed
		orderBy: [{start: 'asc'}, {end: 'asc'}],
	});

export const getWorkspaces = (user: Id): Promise<Workspace[]> =>
	// TODO: only select properties that are needed
	prisma.workspace.findMany({where: {members: {some: {userId: user}}}});

export const createWorkspace = async ({
	name,
	owner,
}: Readonly<{name: string; owner: Id}>): Promise<Id> => {
	const {id} = await prisma.workspace.create({
		select: {id: true},
		data: {name, owner: {connect: {id: owner}}},
	});
	return id;
};

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
	const {id} = await prisma.task.create({
		select: {id: true},
		data: {
			workspace: {connect: {id: workspaceId}},
			tags: {create: tags.map(tag => ({tag}))},
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
	const {id} = await prisma.event.create({
		select: {id: true},
		data: {
			workspace: {connect: {id: workspaceId}},
			tags: {create: tags.map(tag => ({tag}))},
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
	await prisma.task.update({
		select: {id: true},
		where: {id},
		data: {
			workspace: {connect: {id: workspaceId}},
			...(tags
				? {tags: {set: tags.map(tag => ({tag_taskId: {tag, taskId: id}}))}}
				: {}),
			...(assignees ? {assignees: {connect: assignees.map(id => ({id}))}} : {}),
			...(dependencies
				? {dependencies: {connect: dependencies.map(id => ({id}))}}
				: {}),
			...(parents ? {parents: {connect: parents.map(id => ({id}))}} : {}),
			...rest,
		},
	});
};

export const updateEvent = async (
	id: Id,
	{workspaceId, tags, attendees, ...rest}: Partial<CreateEventArgs>,
): Promise<void> => {
	await prisma.event.update({
		select: {id: true},
		where: {id},
		data: {
			workspace: {connect: {id: workspaceId}},
			...(tags
				? {tags: {set: tags.map(tag => ({tag_eventId: {tag, eventId: id}}))}}
				: {}),
			...(attendees ? {attendees: {connect: attendees.map(id => ({id}))}} : {}),
			...rest,
		},
	});
};
