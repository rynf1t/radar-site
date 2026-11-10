import { error } from '@sveltejs/kit';
import { changelog, entryTwin, findEntry } from '#lib/changelog.server.js';
import type { EntryGenerator, RequestHandler } from './$types';

export const entries: EntryGenerator = () => changelog.map((e) => ({ slug: e.slug }));

export const GET: RequestHandler = ({ params }) => {
	const e = findEntry(params.slug);
	if (!e) error(404, 'No changelog entry here');
	return new Response(entryTwin(e), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
};

export const prerender = true;
