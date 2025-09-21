export const MissingAuthError = () => (
	<div className="flex h-full w-full flex-col items-center justify-center">
		<h1 className="mb-4 text-3xl font-bold">Not logged in</h1>
		<p className="text-lg text-gray-600">
			Please log in to access your dashboard.
		</p>
	</div>
);

export default MissingAuthError;
