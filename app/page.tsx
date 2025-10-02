import Link from 'next/link';
import {auth0} from '@/lib/auth0';
// app/page.tsx
export default async function LandingPage() {
	const session = await auth0.getSession();
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-4">
						<div className="text-lg font-semibold text-gray-900">LOGO</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Hero Section */}
				<section className="text-center mb-16">
					<h1 className="text-4xl font-semibold text-gray-900 mb-4">
						Organize Your Team Projects
					</h1>
					<p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
						MonashClubs is a task management platform designed specifically for
						student teams. Create workspaces, assign tasks, schedule events, and
						collaborate effectively on your projects.
					</p>
					{session === null ? (
						<div className="justify-center flex items-center gap-3">
							<Link
								href="/auth/login"
								className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm text-gray-700"
							>
								Sign Up
							</Link>
							<Link
								href="/auth/login"
								className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm text-gray-700"
							>
								Sign In
							</Link>
						</div>
					) : (
						<Link
							href="/workspaces"
							className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm text-gray-700"
						>
							Get Started
						</Link>
					)}
				</section>

				{/* Features Section */}
				<section className="mb-16">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-base font-semibold text-gray-900 mb-2">
								Task Management
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Create, assign, and track tasks with priorities, tags, and due
								dates. Keep your team organized and on schedule.
							</p>
						</div>

						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-base font-semibold text-gray-900 mb-2">
								Team Collaboration
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Work together seamlessly with shared workspaces, real-time
								updates, and clear task assignments for every team member.
							</p>
						</div>

						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="text-base font-semibold text-gray-900 mb-2">
								Project Tracking
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Monitor project progress with visual dashboards, status updates,
								and comprehensive reporting tools.
							</p>
						</div>
					</div>
				</section>

				{/* Stats Section */}
				<section className="bg-white border border-gray-200 rounded-lg p-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div>
							<div className="text-3xl font-bold text-gray-900">200+</div>
							<div className="text-sm text-gray-600 mt-1">Students</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-gray-900">10+</div>
							<div className="text-sm text-gray-600 mt-1">Projects</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-gray-900">150+</div>
							<div className="text-sm text-gray-600 mt-1">Tasks Completed</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-white border-t border-gray-200 mt-auto">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<p className="text-center text-sm text-gray-500">
						© 2025 Team 19. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
// export default function Home() {
// 	return (
// 		<div className="p-2">
// 			<Link href={`/workspaces`}>Workspaces</Link>
// 		</div>
// 	);
// }
