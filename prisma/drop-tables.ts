import {PrismaClient} from '@/lib/generated/prisma';

const prisma = new PrismaClient();

/**
 * This script truncates all tables in the database while preserving the schema.
 * It deletes data in the correct order to respect foreign key constraints.
 */
const truncateAllTables = async (): Promise<void> => {
	console.log('Starting database truncation...');

	try {
		// Begin a transaction to ensure all operations succeed or fail together
		await prisma.$transaction(async tx => {
			console.log('Disabling foreign key checks...');

			console.log('Truncating tables...');

			// First level: Tables without foreign keys others depend on
			await tx.tag.deleteMany({});
			console.log('- Truncated Tag table');

			await tx.workspaceInvite.deleteMany({});
			console.log('- Truncated WorkspaceInvite table');

			// Second level: Junction tables for M:N relationships
			// Clear the Task.assignees relationship (junction table)
			await tx.$executeRawUnsafe('DELETE FROM "_TaskToUser";');
			console.log('- Truncated Task-User assignments');

			// Clear the Event.attendees relationship (junction table)
			await tx.$executeRawUnsafe('DELETE FROM "_EventToUser";');
			console.log('- Truncated Event-User attendees');

			// Clear the Task dependencies relationship (self-referencing junction table)
			await tx.$executeRawUnsafe('DELETE FROM "_TaskDependency";');
			console.log('- Truncated Task dependencies');

			// Third level: Tables with foreign keys
			await tx.workspaceMember.deleteMany({});
			console.log('- Truncated WorkspaceMember table');

			await tx.task.deleteMany({});
			console.log('- Truncated Task table');

			await tx.event.deleteMany({});
			console.log('- Truncated Event table');

			// Fourth level: Top level tables
			await tx.workspace.deleteMany({});
			console.log('- Truncated Workspace table');

			await tx.user.deleteMany({});
			console.log('- Truncated User table');

			console.log('Re-enabling foreign key checks...');
		});

		console.log('Database truncation completed successfully!');
	} catch (error) {
		console.error('Error during database truncation:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};

// Run the truncation function
truncateAllTables()
	.then(() => {
		console.log('Script execution completed.');
		process.exit(0);
	})
	.catch((error: unknown) => {
		console.error('Script execution failed:', error);
		process.exit(1);
	});
