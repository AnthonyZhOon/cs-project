import type {PrismaClient} from '@/lib/generated/prisma';

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

	await prisma.task.create({
		data: {
			workspaceId,
			title: 'Alice Task 1',
			deadline: new Date(2025, 7, 25),
			assignees: {connect: {id: alice}},
		},
	});
	await prisma.task.create({
		data: {
			workspaceId,
			title: 'Alice Task 2',
			deadline: new Date(2025, 8, 1),
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
