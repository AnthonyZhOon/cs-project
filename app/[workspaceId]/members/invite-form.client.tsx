'use client';

import {useState, useTransition} from 'react';
import {inviteMembers} from './actions';

export const InviteForm = ({workspaceId}: {workspaceId: string}) => {
	const [email, setEmail] = useState('');
	const [role, setRole] = useState<'MEMBER' | 'MANAGER'>('MEMBER');
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		if (!email || !email.includes('@')) {
			setError('Please enter a valid email address');
			return;
		}

		startTransition(async () => {
			try {
				await inviteMembers(workspaceId, [{email, memberRole: role}]);
				setSuccess(`Invitation sent to ${email}`);
				setEmail('');
				setRole('MEMBER');
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to send invitation',
				);
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
					{error}
				</div>
			)}
			{success && (
				<div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
					{success}
				</div>
			)}
			<div className="flex gap-3">
				<input
					type="email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder="Enter email address"
					className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={isPending}
				/>
				<select
					value={role}
					onChange={e => setRole(e.target.value as 'MEMBER' | 'MANAGER')}
					className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={isPending}
				>
					<option value="MEMBER">Member</option>
					<option value="MANAGER">Manager</option>
				</select>
				<button
					type="submit"
					disabled={isPending}
					className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isPending ? 'Sending...' : 'Invite'}
				</button>
			</div>
		</form>
	);
};
