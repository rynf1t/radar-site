import { changelog } from '#lib/changelog.server.js';
import { site } from '#lib/site.js';

export function GET() {
	const lines = [`# ${site.name} changelog`, '', 'Newest first.', ''];
	for (const e of changelog) {
		lines.push(`- ${e.date}: [${e.title}](${site.origin}${e.path}.md)${e.version ? ` (${e.version})` : ''}${e.description ? `. ${e.description}` : ''}`);
	}
	lines.push('');
	return new Response(lines.join('\n'), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}

export const prerender = true;
