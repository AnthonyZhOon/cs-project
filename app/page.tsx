import Link from 'next/link';
import {auth0} from '@/lib/auth0';

export default async function LandingPage() {
  const session = await auth0.getSession();
  const user = session?.user;
  const displayName =
    (user?.name as string | undefined) ??
    (user?.email ? user.email.split('@')[0] : undefined);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50">

      <header className="fixed top-0 right-0 p-4">
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">
                Hi, {displayName}
              </span>
              <Link
                href="/workspaces"
                className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
              >
                View your workspace
              </Link>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">
          Monash Clubs Task Management System
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          A simple and efficient way for Monash student clubs to manage tasks,
          deadlines, and events.
        </p>
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
            Manage and switch across multiple clubs and workspaces with ease,
            all in one platform.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Management</h2>
          <p className="text-gray-600">
            Manage both tasks and events in a single integrated system, so
            deadlines and activities stay connected.
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
