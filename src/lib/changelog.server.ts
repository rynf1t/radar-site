// Release notes, one Markdown file each in content/changelog, named like
// 2026-11-10-toasts.md. Newest first everywhere they appear.
import { frontMatter, markdownTwin, render } from './docs.server.js';

export type Entry = {
	slug: string; // e.g. "2026-11-10-toasts"
	path: string; // e.g. "/changelog/2026-11-10-toasts"
	date: string; // ISO, from the file name
	title: string;
	description: string;
	version: string;
	body: string;
	html: string;
	lead: string; // the first paragraph, as HTML
};

const files = import.meta.glob('/content/changelog/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export const changelog: Entry[] = Object.entries(files)
	.map(([file, raw]) => {
		const m = file.match(/\/content\/changelog\/(\d{4}-\d{2}-\d{2})-([\w-]+)\.md$/);
		if (!m) throw new Error(`${file}: changelog files are named like 2026-11-10-what-changed.md`);
		const slug = `${m[1]}-${m[2]}`;
		const { meta, body } = frontMatter(raw);
		const { html } = render(body);
		const lead = html.match(/<p[^>]*>[\s\S]*?<\/p>/)?.[0] ?? '';
		return {
			slug,
			path: `/changelog/${slug}`,
			date: m[1],
			title: meta.title ?? m[2],
			description: meta.description ?? '',
			version: meta.version ?? '',
			body,
			html,
			lead
		} satisfies Entry;
	})
	.sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));

/** An entry as Markdown, with its date in the title. */
export function entryTwin(e: Entry) {
	return markdownTwin({ ...e, title: `${e.title} (${e.date})` });
}

export function findEntry(slug: string) {
	return changelog.find((e) => e.slug === slug);
}

/** "10 NOV 2026", for the spaced mono date line. */
export function formatDate(iso: string) {
	return new Date(`${iso}T00:00:00Z`)
		.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
		.toUpperCase();
}
