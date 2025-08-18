import {PrismaClient} from './generated/prisma';

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const prisma =
	(globalForPrisma as {prisma?: PrismaClient}).prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

export {Prisma} from './generated/prisma';

export type TransactionClient = Parameters<
	Parameters<PrismaClient['$transaction']>[0]
>[0];
