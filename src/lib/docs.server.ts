// The docs, declared once. Every page, its HTML, its Markdown twin, the
// sidebar, llms.txt and the search index all come from content/docs.
import { Marked, type Tokens } from 'marked';
import { createCssVariablesTheme, createHighlighter } from 'shiki';
import { href, site } from './site.js';

export type Heading = { id: string; text: string };
export type Doc = {
	slug: string; // e.g. "installation"
	path: string; // e.g. "/docs/installation"
	title: string;
	description: string;
	group: string;
	order: number;
	body: string; // Markdown without front matter
	html: string;
	headings: Heading[];
};
export type NavGroup = { label: string; items: { title: string; path: string; headings: Heading[] }[] };
export type SearchEntry = { path: string; title: string; page: string; group: string; text: string };

const files = import.meta.glob('/content/docs/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

// Add a language here when a page needs it. Anything else renders as plain text.
const langs = ['sh', 'go', 'json', 'lua', 'ts', 'js', 'yaml', 'toml', 'swift', 'python', 'rust'];
const theme = createCssVariablesTheme({ name: 'css-variables', variablePrefix: '--shiki-' });
const highlighter = await createHighlighter({ themes: [theme], langs });

// What marked passes as `this` to renderer methods.
type RendererThis = { parser: { parseInline(t: Tokens.Generic[]): string } };

const copyButton = `<button type="button" class="copy" aria-label="Copy code"><svg class="idle" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="2"/><path d="M10.5 3.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3.5V9A1.5 1.5 0 0 0 4 10.5"/></svg><svg class="done" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7"/></svg></button>`;
const anchorIcon = `<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" aria-hidden="true"><path d="M6.5 9.5a2.8 2.8 0 0 0 4 0l2.2-2.2a2.8 2.8 0 0 0-4-4l-.7.7"/><path d="M9.5 6.5a2.8 2.8 0 0 0-4 0L3.3 8.7a2.8 2.8 0 0 0 4 4l.7-.7"/></svg>`;

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/<[^>]+>/g, '')
		.replace(/[`'"?.,:!()]/g, '')
		.trim()
		.replace(/\s+/g, '-');

export function frontMatter(raw: string) {
	const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
	const meta: Record<string, string> = {};
	if (!m) return { meta, body: raw };
	for (const line of m[1].split('\n')) {
		const i = line.indexOf(':');
		if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
	}
	return { meta, body: raw.slice(m[0].length).trim() + '\n' };
}

// One link renderer for docs pages and config text.
function link(this: RendererThis, t: Tokens.Link) {
	const rel = /^https?:/.test(t.href) ? ' rel="noopener"' : '';
	// Plain files, not pages, so the router must not handle them.
	const file = /\.(md|txt|json)(#|$)/.test(t.href) ? ' data-sveltekit-reload' : '';
	return `<a href="${href(t.href)}"${rel}${file}>${this.parser.parseInline(t.tokens)}</a>`;
}

export function render(body: string) {
	const headings: Heading[] = [];
	let first = true;
	const marked = new Marked({
		gfm: true,
		renderer: {
			heading(this: RendererThis, t: Tokens.Heading) {
				const inner = this.parser.parseInline(t.tokens);
				const id = slugify(t.text);
				if (t.depth === 2) headings.push({ id, text: t.text.replace(/`/g, '') });
				return `<h${t.depth} id="${id}">${inner}<a class="anchor" href="#${id}" aria-label="Link to this section">${anchorIcon}</a></h${t.depth}>\n`;
			},
			paragraph(this: RendererThis, t: Tokens.Paragraph) {
				const lead = first && t.tokens.length === 1 && t.tokens[0].type === 'strong';
				first = false;
				if (lead) {
					const strong = t.tokens[0] as Tokens.Strong;
					return `<p class="lead">${this.parser.parseInline(strong.tokens)}</p>\n`;
				}
				return `<p>${this.parser.parseInline(t.tokens)}</p>\n`;
			},
			code(t: Tokens.Code) {
				const lang = langs.includes(t.lang ?? '') ? t.lang! : 'text';
				const html = highlighter.codeToHtml(t.text, { lang, theme: 'css-variables' });
				return `<div class="code edge">${html}${copyButton}</div>\n`;
			},
			table(this: RendererThis, t: Tokens.Table) {
				const cell = (c: Tokens.TableCell) => this.parser.parseInline(c.tokens);
				const head = t.header.map((c) => `<th scope="col">${cell(c)}</th>`).join('');
				const rows = t.rows.map((r) => `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join('')}</tr>`).join('');
				const wide = t.header.length > 2 ? ' wide' : '';
				return `<div class="table edge${wide}"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
			},
			link,
		}
	});
	const html = marked.parse(body, { async: false }) as string;
	return { html, headings };
}

export const docs: Doc[] = Object.entries(files)
	.map(([file, raw]) => {
		const m = file.match(/\/content\/docs\/(\d+)-([\w-]+)\.md$/);
		if (!m) throw new Error(`${file}: docs files are named like 01-installation.md`);
		const [, num, name] = m;
		const order = Number(num);
		const { meta, body } = frontMatter(raw);
		const { html, headings } = render(body);
		return {
			slug: name,
			path: `/docs/${name}`,
			title: meta.title ?? name,
			description: meta.description ?? '',
			group: meta.group ?? 'Docs',
			order,
			body,
			html,
			headings
		} satisfies Doc;
	})
	.sort((a, b) => a.order - b.order);

export function findDoc(slug: string) {
	return docs.find((d) => d.slug === slug);
}

export function nav(): NavGroup[] {
	const groups: NavGroup[] = [];
	for (const d of docs) {
		let g = groups.find((x) => x.label === d.group);
		if (!g) groups.push((g = { label: d.group, items: [] }));
		g.items.push({ title: d.title, path: d.path, headings: d.headings });
	}
	return groups;
}

/** The Markdown twin: front matter, then the body with links pointing at other twins. */
export function markdownTwin(d: Pick<Doc, 'title' | 'description' | 'path' | 'body'>) {
	const body = d.body
		// Empty decorative spans, like coloured dots, mean nothing as Markdown.
		.replace(/<span[^>]*><\/span>\s*/g, '')
		.replace(/\]\((\/docs\/[\w/-]+)(#[\w-]+)?\)/g, (_, p, h = '') => `](${site.origin}${p}.md${h})`);
	return `---\ntitle: ${JSON.stringify(d.title)}\ndescription: ${JSON.stringify(d.description)}\ncanonical_url: ${site.origin}${d.path}\n---\n\n# ${d.title}\n\n${body}`;
}

const plain = (md: string) =>
	md
		.replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*/g, ' '))
		.replace(/<[^>]+>/g, '')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*`#|>]/g, ' ')
		.replace(/-{3,}/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

type Searchable = { path: string; title: string; description: string; body: string };

/** One search entry per page section, so a result can land on the right heading. */
export function searchEntries(page: Searchable, group: string): SearchEntry[] {
	const parts = page.body.split(/^## /m);
	const out: SearchEntry[] = [
		{ path: page.path, title: page.title, page: page.title, group, text: `${page.description} ${plain(parts[0])}` }
	];
	for (const part of parts.slice(1)) {
		const nl = part.indexOf('\n');
		const heading = part.slice(0, nl).trim();
		out.push({
			path: `${page.path}#${slugify(heading)}`,
			title: heading.replace(/`/g, ''),
			page: page.title,
			group,
			text: plain(part.slice(nl))
		});
	}
	return out;
}

const inlineMarked = new Marked({
	renderer: {
		link
	}
});

/** Inline Markdown from site.config.ts, as HTML. */
export function inline(md: string) {
	return inlineMarked.parseInline(md, { async: false }) as string;
}

/** A site path as a full URL, pointing docs pages at their Markdown twins. */
export function absoluteHref(path: string) {
	if (!path.startsWith('/')) return path;
	const [p, h = ''] = path.split('#');
	const twin = p.startsWith('/docs/') ? `${p}.md` : p;
	return `${site.origin}${twin}${h && '#' + h}`;
}

/** Site links in config text, made absolute for Markdown readers. */
export function absolute(md: string) {
	return md.replace(/\]\((\/[^)]*)\)/g, (_, p: string) => `](${absoluteHref(p)})`);
}
