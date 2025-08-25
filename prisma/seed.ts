import type {Id} from '@/lib/types';
import type {PrismaClient} from '@/lib/prisma';

export default async (prisma: PrismaClient): Promise<void> => {
	const {id: alice} = await prisma.user.create({
		data: {
			name: 'Alice',
			email: 'axxx0000@student.monash.edu',
		},
		select: {id: true},
	});
	const {id: bob} = await prisma.user.create({
		data: {
			name: 'Bob',
			email: 'bxxx0000@student.monash.edu',
		},
		select: {id: true},
	});
	const {id: workspaceId} = await prisma.workspace.create({
		data: {
			name: 'Club',
			owner: {connect: {id: alice}},
			members: {
				createMany: {
					data: [
						{userId: alice, role: 'MANAGER'},
						{userId: bob, role: 'MEMBER'},
					],
				},
			},
		},
		select: {id: true},
	});

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const tags = (...tags: readonly string[]) => ({
		connectOrCreate: tags.map(name => ({
			where: {workspaceId_name: {workspaceId, name}},
			create: {workspaceId, name},
		})),
	});

	await prisma.task.create({
		data: {
			workspaceId,
			title: 'Alice Task 1',
			deadline: new Date('2025-08-24'),
			tags: tags('tag1', 'tag2'),
			assignees: {connect: {id: alice}},
		},
	});
	await prisma.task.create({
		data: {
			workspaceId,
			title: 'Alice Task 2',
			deadline: new Date('2025-08-31'),
			tags: tags('tag2', 'tag3'),
			assignees: {connect: {id: alice}},
		},
	});
	await prisma.task.create({
		data: {
			workspaceId,
			title: 'Bob Task 1',
			deadline: new Date(2025, 7, 26),
			assignees: {connect: {id: bob}},
		},
	});
	await prisma.task.create({
		data: {
			workspaceId,
			title: 'Bob Task 2',
			deadline: new Date(2025, 8, 2),
			assignees: {connect: {id: bob}},
		},
	});
};
