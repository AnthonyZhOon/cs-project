import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">

      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">
          Monash Clubs Task Management System
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          A simple and efficient way for Monash student clubs to manage tasks,
          deadlines, and events.
        </p>
        <Link
          href="/workspaces"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl py-16">
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Task Assignment</h2>
          <p className="text-gray-600">
            Assign tasks clearly so everyone knows their responsibilities.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Multiple Workspaces</h2>
          <p className="text-gray-600">
            Manage and switch across multiple clubs and workspaces with ease, all in one platform.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Management</h2>
          <p className="text-gray-600">
            Manage both tasks and events in a single integrated system, so deadlines and activities stay connected.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-gray-500">
        © 2025 Monash Clubs Task Management System - Team G19
      </footer>
    </main>
  );
}
