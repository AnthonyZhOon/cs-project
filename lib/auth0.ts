import {Auth0Client} from '@auth0/nextjs-auth0/server';
import type {Auth0ClientOptions} from '@auth0/nextjs-auth0/types';

const domain: string = process.env.AUTH0_ISSUER_BASE_URL ?? '';
const appBaseUrl: string = process.env.AUTH0_BASE_URL ?? '';
const secret: string = process.env.AUTH0_CLIENT_SECRET ?? '';
const options: Auth0ClientOptions = {
	domain,
	appBaseUrl,
	secret,
};

export const auth0: Auth0Client = new Auth0Client(options);
