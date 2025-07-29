'use client';
import Link from 'next/link';
// import {useRouter} from 'next/navigation'

export default function Header() {
	// const router = useRouter()
	const isActive: (pathname: string) => boolean = () => true;

	const left = (
		<div className="left">
			<Link href="/" className="bold" data-active={isActive('/')}>
				Feed
			</Link>
			<style jsx>{`
				.bold {
					font-weight: bold;
				}

				a {
					text-decoration: none;
					color: #000;
					display: inline-block;
				}

				.left a[data-active='true'] {
					color: gray;
				}

				a + a {
					margin-left: 1rem;
				}
			`}</style>
		</div>
	);

	const right = null;

	return (
		<nav>
			{left}
			{right}
			<style jsx>{`
				nav {
					display: flex;
					padding: 2rem;
					align-items: center;
				}
			`}</style>
		</nav>
	);
}
