import Header from './Header';
import type {PropsWithChildren} from 'react';

export default function Layout(props: PropsWithChildren) {
	return (
		<div className="w-screen max-w-screen">
			<Header />
			<div className="layout">{props.children}</div>
		</div>
	);
}
