import { changelog } from '#lib/changelog.server.js';
import { docs } from '#lib/docs.server.js';
import { site } from '#lib/site.js';

export function GET() {
	const lines = [
		`# ${site.name}`,
		'',
		`> ${site.description}`,
		'',
		'Every page is Markdown at the same URL with `.md` added. The full set is in /llms-full.txt and a JSON index is at /search.json.',
		'',
		`- [${site.name}](${site.origin}/index.md): what it is and how to install it`,
		`- [Source](${site.repo})`,
		''
	];
	let group = '';
	for (const d of docs) {
		if (d.group !== group) {
			if (group) lines.push('');
			lines.push(`## ${(group = d.group)}`, '');
		}
		lines.push(`- [${d.title}](${site.origin}${d.path}.md): ${d.description}`);
	}
	if (changelog.length) {
		lines.push('', '## Changelog', '', `- [All entries](${site.origin}/changelog.md): newest first`);
		for (const e of changelog.slice(0, 10)) lines.push(`- [${e.title}](${site.origin}${e.path}.md): ${e.date}`);
	}
	lines.push('');
	return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

export const prerender = true;
