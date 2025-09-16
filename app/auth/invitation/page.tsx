'use client';

export default function InvitationPage() {
	return (
		<>
			<h2 className="text-xl font-bold mb-2">Welcome !</h2>
			<h3 className="text-lg mb-6">You have been invited to...</h3>
			<p className="mb-6 text-gray-700">[Workspace name]</p>

			<div className="space-y-3">
				<button className="w-full bg-black text-white py-2 rounded">
					Join the workspace
				</button>
				<button className="w-full border rounded py-2">
					Create new workspace
				</button>
			</div>
		</>
	);
}
