import * as childProcess from 'node:child_process';
import {promisify} from 'node:util';
import {nanoid} from 'nanoid';
import * as pg from 'pg';
import {PrismaClient} from '@/lib/generated/prisma';
import seed from '../prisma/seed';
import type {Environment, EnvironmentReturn} from 'vitest/environments';

const execFile = promisify(childProcess.execFile);

const DATABASE_URL = 'NEON_POSTGRES_PRISMA_URL';
const DATABASE_DIRECT_URL = 'NEON_DATABASE_URL_UNPOOLED';

const connectionString = (database: string): string =>
	`postgres://prisma:password@localhost:54320/${database}`;

export default {
	name: 'prisma',
	transformMode: 'ssr',
	setup: async (global: typeof globalThis): Promise<EnvironmentReturn> => {
		// https://github.com/ctrlplusb/prisma-pg-jest/blob/1a4519d17b5e3998932dd4136479ad268bbc41b9/prisma/prisma-test-environment.js
		// as of prisma v6.13.0, the migrations include the schema name (public) https://github.com/prisma/prisma/issues/27811,
		// so instead of creating new schemas we create new databases
		const database = `test_${nanoid()}`;

		const dropDB = async (): Promise<void> => {
			const client = new pg.Client({
				connectionString: connectionString('dev'),
			});
			try {
				await client.connect();
				await client.query(`DROP DATABASE IF EXISTS "${database}"`);
			} finally {
				await client.end();
			}
		};

		const oldDatabaseURL = process.env[DATABASE_URL];
		const oldUnpooledURL = process.env[DATABASE_DIRECT_URL];
		process.env[DATABASE_URL] =
			global.process.env[DATABASE_URL] =
			process.env[DATABASE_DIRECT_URL] =
			global.process.env[DATABASE_DIRECT_URL] =
				connectionString(database);

		try {
			await execFile('pnpm', ['prisma', 'migrate', 'deploy']);

			const prisma = new PrismaClient();
			try {
				await seed(prisma);
			} finally {
				await prisma.$disconnect();
			}
		} catch (error) {
			await dropDB();
			throw error;
		}

		return {
			teardown: async (global: typeof globalThis): Promise<void> => {
				await dropDB();

				process.env[DATABASE_URL] = global.process.env[DATABASE_URL] =
					oldDatabaseURL;
				process.env[DATABASE_DIRECT_URL] = global.process.env[
					DATABASE_DIRECT_URL
				] = oldUnpooledURL;
			},
		};
	},
} satisfies Environment;
