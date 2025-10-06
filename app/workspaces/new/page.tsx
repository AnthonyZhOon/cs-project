'use client';
import {useState} from 'react';
import Input from '@/components/inputs/Input';
import {createWorkspaceAction} from './actions';

export default function CreateWorkspacePage() {
	const [members, setMembers] = useState([{email: '', role: 'MEMBER'}]);

	const addMember = () => {
		setMembers([...members, {email: '', role: 'MEMBER'}]);
	};

	const updateMember = (
		index: number,
		field: 'email' | 'role',
		value: string,
	) => {
		const newMembers = [...members];
		newMembers[index]![field] = value;
		setMembers(newMembers);
	};

	return (
		<>
			<h2 className="text-xl font-bold mb-2">Welcome!</h2>
			<h3 className="text-lg mb-6">Create your workspace</h3>

			<form action={createWorkspaceAction} className="space-y-4">
				{/* Workspace name */}
				<Input
					label="Workspace name"
					placeholder="Enter workspace name"
					name="workspace"
					required
				/>

				<div className="space-y-3">
					<div className="block font-medium text-sm">
						Invite others (optional)
					</div>
					{members.map((member, idx) => (
						<div key={idx} className="flex gap-2">
							<input
								type="email"
								name={`member-${idx}-email`}
								placeholder="Enter email to invite"
								value={member.email}
								onChange={e => updateMember(idx, 'email', e.target.value)}
								className="flex-1 border p-2 rounded"
							/>
							<select
								name={`member-${idx}-role`}
								value={member.role}
								onChange={e => updateMember(idx, 'role', e.target.value)}
								className="w-32 border p-2 rounded"
							>
								<option value="MEMBER">Member</option>
								<option value="MANAGER">Manager</option>
							</select>
						</div>
					))}
					<input type="hidden" name="members-count" value={members.length} />
					<button
						type="button"
						onClick={addMember}
						className="text-sm text-blue-600 hover:underline"
					>
						+ Add more member
					</button>
				</div>

				<button
					type="submit"
					className="block w-full bg-black text-white py-2 rounded mt-4 text-center"
				>
					Create
				</button>
			</form>
		</>
	);
}
