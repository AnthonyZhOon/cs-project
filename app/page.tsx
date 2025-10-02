import Link from 'next/link';

export default function Home() {
	return (
		<div className="p-2">
			<Link href={`/workspaces`}>Workspaces</Link>
		</div>
	);
}
