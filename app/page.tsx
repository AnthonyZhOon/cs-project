import prisma from '@/lib/prisma';
import { auth0 } from "@/lib/auth0";
// const getFeed = () => {
// 	const feed = [
// 		{
// 			id: '1',
// 			title: 'Prisma is the perfect ORM for Next.js',
// 			content:
// 				'[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!',
// 			published: false,
// 			author: {
// 				name: 'Nikolas Burk',
// 				email: 'burk@prisma.io',
// 			},
// 		},
// 		{
// 			id: '2',
// 			title: 'Prisma is the perfect ORM for Next.js',
// 			content:
// 				'[Prisma](https://github.com/prisma/prisma) and Next.js go _great_ together!',
// 			published: false,
// 			author: {
// 				name: 'Nikolas Burk',
// 				email: 'burk@prisma.io',
// 			},
// 		},
// 	]
// 	return feed
// }

const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export default async function Blog() {
  const session = await auth0.getSession();

  // If no session, show sign-up and login buttons
  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">
          <button>Sign up</button>
        </a>
        <a href="/auth/login">
          <button>Log in</button>
        </a>
      </main>
    );
  }

  const users = await getUsers();
  // If session exists, show a welcome message and logout button
  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      <p>
        <a href="/auth/logout">
          <button>Log out</button>
        </a>
      </p>
      <div>
        <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
          {users.map((user) => (
            <li key={user.id} className="mb-2">
              {user.name}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
