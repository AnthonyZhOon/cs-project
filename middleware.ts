import {auth0} from './lib/auth0';
import type {NextRequest, NextResponse} from 'next/server';

export const middleware = async (request: NextRequest): Promise<NextResponse> =>
	auth0.middleware(request);

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico, sitemap.xml, robots.txt (metadata files)
		 */
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
};
