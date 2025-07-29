'use client';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export interface PostProps {
	id: string;
	title: string;
	author: {
		name: string;
		email: string;
	} | null;
	content: string;
	published: boolean;
}

export default function Post(post: PostProps) {
	const authorName = post.author ? post.author.name : 'Unknown author';
	return (
		<Link href={`/p/${post.id}`}>
			<h2>{post.title}</h2>
			<small>By {authorName}</small>
			<ReactMarkdown>{post.content}</ReactMarkdown>
			<style jsx>{`
				div {
					color: inherit;
					padding: 2rem;
				}
			`}</style>
		</Link>
	);
}
