import { changelog, formatDate } from '#lib/changelog.server.js';

export function load() {
	return {
		entries: changelog.map((e) => ({ path: e.path, title: e.title, version: e.version, date: formatDate(e.date), lead: e.lead }))
	};
}
