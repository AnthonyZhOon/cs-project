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

describe('Tasks', () => {
	test('getTasks', () =>
		expect(api.getTasks(alice)).resolves.toMatchObject([
			{
				deadline: new Date('2025-08-24T14:00:00.000Z'),
				description: null,
				priority: null,
				status: 'TODO',
				title: 'Alice Task 1',
				visibility: 'MEMBER',
			},
			{
				deadline: new Date('2025-08-31T14:00:00.000Z'),
				description: null,
				priority: null,
				status: 'TODO',
				title: 'Alice Task 2',
				visibility: 'MEMBER',
			},
		]));
});
