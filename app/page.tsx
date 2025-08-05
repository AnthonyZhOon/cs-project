import ComponentBox from '@/components/ComponentBox'
import prisma from '@/lib/prisma';

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
			<ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
				{users.map(user => (
					<li key={user.id} className="mb-2">
						{user.name}
					</li>
				))}
			</ol>
			
			<ComponentBox title="Title">
				Content
			</ComponentBox>

		</div>
	);
}
