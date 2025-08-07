import prisma from './prisma';
import type {
	Event,
	Id,
	Priority,
	Task,
	TaskStatus,
	WorkspaceMemberRole,
} from './types';

/* Sorted by deadline in ascending order */
export const getTasks = (user: string): Promise<Task[]> =>
	prisma.task.findMany({
		where: {assignees: {some: {id: user}}},
		orderBy: {deadline: 'asc'},
	});

/* Sorted by start time and then end time in ascending order */
export const getEvents = (user: string): Promise<Event[]> =>
	prisma.event.findMany({
		where: {attendees: {some: {id: user}}},
		orderBy: [{start: 'asc'}, {end: 'asc'}],
	});

export const createTask = async ({
	workspaceId,
	tags = [],
	assignees = [],
	dependencies = [],
	parents = [],
	...rest
}: Readonly<{
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
}>): Promise<Id> => {
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

export const createEvent = async ({
	workspaceId,
	tags = [],
	attendees = [],
	...rest
}: Readonly<{
	title: string;
	workspaceId: Id;
	description?: string;
	visibility?: WorkspaceMemberRole;
	start: Date;
	end: Date;
	tags?: readonly string[];
	attendees?: readonly Id[];
}>): Promise<Id> => {
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
