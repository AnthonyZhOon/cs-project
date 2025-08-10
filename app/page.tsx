import ComponentBox from '@/components/ComponentBox'
import prisma from '@/lib/prisma';
import Link from 'next/link';

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
	const users = await getUsers();
	// const feed = getFeed()
	return (
		<div className="p-2">
			<div className="mb-4">
        		<Link
          			href="/tasks/new"
          			className="px-3 py-1 bg-white text-black rounded hover:bg-gray-800"
       			>
          	Create Task
        </Link>
			<Link
				href="/events/new"
				className="px-3 py-1 bg-white text-black rounded hover:bg-gray-800"
			>
				Create Event
			</Link>
      </div>
	  
			<ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
				{users.map(user => (
					<li key={user.id} className="mb-2">
						{user.name}
					</li>
				))}
			</ol>

			{/* Example Component Box */}
			<div className="w-sm">
				<ComponentBox title="Title">
					Content

					<ul className="list-disc list-inside">
						<li>Item 1</li>
						<li>Item 2</li>
						<li>Item 3</li>
						<li>Item 4</li>
					</ul>
				</ComponentBox>
			</div>
		</div>
	);
}
