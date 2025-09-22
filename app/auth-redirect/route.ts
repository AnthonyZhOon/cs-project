import {NextResponse, type NextRequest} from 'next/server';
import api from '@/lib/api';
import {auth0} from '@/lib/auth0';

export const GET = async (req: NextRequest): Promise<NextResponse> => {
	const session = await auth0.getSession();
	if (!session) throw new Error('not logged in');

	const {sub, email, name} = session.user;
	if (email === undefined) throw new Error('no email');
	if (name === undefined) throw new Error('no name');
	await api.login({id: sub, email, name});

	return NextResponse.redirect(
		new URL(
			req.nextUrl.searchParams.get('returnTo') ?? '/workspaces',
			req.nextUrl.origin,
		),
	);
};
