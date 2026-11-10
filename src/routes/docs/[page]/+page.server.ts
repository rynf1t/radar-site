import { error } from '@sveltejs/kit';
import { docs, findDoc } from '#lib/docs.server.js';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => docs.map((d) => ({ page: d.slug }));

export const load: PageServerLoad = ({ params }) => {
	const doc = findDoc(params.page);
	if (!doc) error(404, 'No docs page here');
	const i = docs.indexOf(doc);
	const link = (d?: (typeof docs)[number]) => (d ? { title: d.title, path: d.path } : null);
	return {
		doc: { title: doc.title, description: doc.description, html: doc.html, path: doc.path, group: doc.group },
		prev: link(docs[i - 1]),
		next: link(docs[i + 1])
	};
};
