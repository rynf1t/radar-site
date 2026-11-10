import { error } from '@sveltejs/kit';
import { changelog, findEntry, formatDate } from '#lib/changelog.server.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => changelog.map((e) => ({ slug: e.slug }));

export const load: PageServerLoad = ({ params }) => {
	const e = findEntry(params.slug);
	if (!e) error(404, 'No changelog entry here');
	return { entry: { title: e.title, description: e.description, version: e.version, date: formatDate(e.date), html: e.html, path: e.path } };
};
