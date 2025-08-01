import {PrismaClient} from '../app/generated/prisma';

const globalForPrisma = global as unknown as {
	prisma: PrismaClient;
};

const prisma =
	(globalForPrisma as {prisma?: PrismaClient}).prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
