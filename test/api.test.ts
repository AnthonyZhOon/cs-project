import {afterAll, describe, expect, test} from 'vitest';
import {createAPI} from '@/lib/api';
import {PrismaClient} from '@/lib/generated/prisma';

const prisma = new PrismaClient();
afterAll(async () => prisma.$disconnect());
const api = createAPI(prisma);

const {id: alice} = await prisma.user.findFirstOrThrow({
	select: {id: true},
	where: {name: 'Alice'},
});

const {id: bob} = await prisma.user.findFirstOrThrow({
	select: {id: true},
	where: {name: 'Bob'},
});

const {id: workspaceId} = await prisma.workspace.findFirstOrThrow({
	select: {id: true},
});

describe('Tasks', () => {
	describe('getTasks', () => {
		test('should return only user’s tasks', async () => {
			expect(await api.getTasks(alice)).toMatchObject([
				{
					deadline: new Date('2025-08-24'),
					description: null,
					priority: null,
					status: 'TODO',
					title: 'Alice Task 1',
					visibility: 'MEMBER',
				},
				{
					deadline: new Date('2025-08-31'),
					description: null,
					priority: null,
					status: 'TODO',
					title: 'Alice Task 2',
					visibility: 'MEMBER',
				},
			]);
		});
	});

	describe('createTask', () => {
		test('supports tasks having the same tags', async () => {
			await api.createTask({
				workspaceId,
				title: 'Task 1',
				tags: ['tag1', 'tag2'],
			});
			await api.createTask({
				workspaceId,
				title: 'Task 2',
				tags: ['tag1', 'tag3'],
			});
		});
	});
});
