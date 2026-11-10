import { error } from '@sveltejs/kit';
import { docs, findDoc, markdownTwin } from '#lib/docs.server.js';
import type { EntryGenerator, RequestHandler } from './$types';

export const entries: EntryGenerator = () => docs.map((d) => ({ page: d.slug }));

export const GET: RequestHandler = ({ params }) => {
	const doc = findDoc(params.page);
	if (!doc) error(404, 'No docs page here');
	return new Response(markdownTwin(doc), {
		headers: { 'content-type': 'text/markdown; charset=utf-8' }
	});
};

export const prerender = true;
