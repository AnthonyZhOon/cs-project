import Header from './Header';
import type {PropsWithChildren} from 'react';

export default function Layout(props: PropsWithChildren) {
	return (
		<div>
			<Header />
			<div className="layout">{props.children}</div>
			<style jsx global>{`
				html {
					box-sizing: border-box;
				}

				*,
				*:before,
				*:after {
					box-sizing: inherit;
				}

				body {
					margin: 0;
					padding: 0;
					font-size: 16px;
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
						Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
						'Segoe UI Symbol';
					background: rgba(0, 0, 0, 0.05);
				}

				input,
				textarea {
					font-size: 16px;
				}

				button {
					cursor: pointer;
				}
			`}</style>
			<style jsx>{`
				.layout {
					padding: 0 2rem;
				}
			`}</style>
		</div>
	);
}
