import { changelog } from '#lib/changelog.server.js';
import { docs, searchEntries } from '#lib/docs.server.js';

export function GET() {
	return Response.json([
		...docs.flatMap((d) => searchEntries(d, d.group)),
		...changelog.flatMap((e) => searchEntries(e, 'Changelog'))
	]);
}

export const prerender = true;
