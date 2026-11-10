// The landing page as data (for +page.svelte) and as Markdown (for /index.md
// and llms.txt). Both come from site.config.ts, so they can't drift apart.
import { absolute, absoluteHref, docs, inline } from './docs.server.js';
import { site } from './site.js';

export function landing() {
	return {
		lead: inline(site.hero.lead),
		sections: site.sections.map((s) => ({ ...s, body: inline(s.body) })),
		questions: site.questions.map((q) => ({ q: q.q, a: inline(q.a) }))
	};
}

export function landingMarkdown() {
	const out = [
		'---',
		`title: ${JSON.stringify(site.name)}`,
		`description: ${JSON.stringify(site.description)}`,
		`canonical_url: ${site.origin}/`,
		'---',
		'',
		`# ${site.name}`,
		'',
		`**${site.hero.title}**`,
		'',
		absolute(site.hero.lead),
		'',
		'```sh',
		site.install,
		'```',
		'',
		site.requirement,
		''
	];
	for (const s of site.sections) {
		out.push(`## ${s.title}`, '', absolute(s.body), '');
		if (s.items) {
			out.push('| | |', '|---|---|', ...s.items.map((i) => `| ${i.name} | ${i.text} |`), '');
		}
		if (s.code) out.push('```', s.code, '```', '');
		if (s.link) out.push(`[${s.link.label}](${absoluteHref(s.link.href)})`, '');
	}
	if (site.questions.length) {
		out.push('## Questions', '');
		for (const q of site.questions) out.push(`**${q.q}** ${absolute(q.a)}`, '');
	}
	out.push('## Docs', '');
	for (const d of docs) out.push(`- [${d.title}](${site.origin}${d.path}.md): ${d.description}`);
	out.push('', `The full index is at [llms.txt](${site.origin}/llms.txt).`, '');
	return out.join('\n');
}
