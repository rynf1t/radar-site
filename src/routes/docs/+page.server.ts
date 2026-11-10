import { redirect } from '@sveltejs/kit';
import { docs } from '#lib/docs.server.js';
import { href } from '#lib/site.js';

// /docs opens at the first page, which should be Installation.
export function load() {
	redirect(308, href(docs[0].path));
}
