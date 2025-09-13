'use client';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <>
      <h2 className="text-xl font-bold mb-2">Welcome !</h2>
      <h3 className="text-lg mb-6">Sign up to G19 Task Management System</h3>

      <div className="space-y-3">
        <Link
          href="/"
          className="w-full border rounded p-2 flex items-center justify-center block text-center"
        >
          <span className="mr-2">🌐</span> Continue with Google
        </Link>

        <Link
          href="/"
          className="w-full border rounded p-2 flex items-center justify-center block text-center"
        >
          <span className="mr-2">☀️</span> Continue with [XXXXX]
        </Link>

        <Link
          href="/"
          className="w-full border rounded p-2 flex items-center justify-center block text-center"
        >
          <span className="mr-2">⚡</span> Continue with [XXXXX]
        </Link>
      </div>
    </>
  );
}
