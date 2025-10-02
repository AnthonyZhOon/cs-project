'use server';

import api from '@/lib/api';
import type {Priority, TaskStatus} from '@/lib/types';

interface TaskInput {
	title: string;
	description?: string;
	tags?: string[];
	assignees?: string[];
	dependencies?: string[];
	priority?: Priority;
	status?: TaskStatus;
	deadline?: Date;
}

const toMessage = (err: unknown): string => {
	if (err instanceof AggregateError)
		return Array.from(err.errors, e => (e as Error).message).join('\n');

	return err instanceof Error ? err.message : 'Unknown error';
};

type Result = {ok: true} | {ok: false; error: string};

const catch_ = async (f: () => Promise<unknown>): Promise<Result> => {
	try {
		await f();
		return {ok: true};
	} catch (e) {
		return {ok: false, error: toMessage(e)};
	}
};

export const createTaskAction = async (
	workspaceId: string,
	data: TaskInput,
): Promise<Result> =>
	catch_(async () => api.createTask({workspaceId, ...data}));

export const updateTaskAction = async (
	taskId: string,
	data: TaskInput,
): Promise<Result> => catch_(async () => api.updateTask(taskId, data));

export const deleteTaskAction = async (taskId: string): Promise<Result> =>
	catch_(async () => api.deleteTask(taskId));
