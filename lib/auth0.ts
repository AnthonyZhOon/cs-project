import {Auth0Client} from '@auth0/nextjs-auth0/server';
import {NextResponse} from 'next/server';
import type {Auth0ClientOptions} from '@auth0/nextjs-auth0/types';

const domain = process.env.AUTH0_ISSUER_BASE_URL ?? '';
const appBaseUrl = process.env.AUTH0_BASE_URL ?? '';
const secret = process.env.AUTH0_CLIENT_SECRET ?? '';

const options: Auth0ClientOptions = {
	domain,
	appBaseUrl,
	secret,
	routes: {
		login: '/auth/login',
	},
	// eslint-disable-next-line @typescript-eslint/require-await
	onCallback: async (error, ctx) => {
		if (error) throw error;
		return NextResponse.redirect(
			new URL(`/auth-redirect?returnTo=${ctx.returnTo}`, appBaseUrl),
		);
	},
};

export const auth0: Auth0Client = new Auth0Client(options);
