// Everything that makes this site about radar. The landing page, its
// Markdown twin, llms.txt, the header, the favicon and the colours all come
// from here. Docs pages live in content/docs. See AGENTS.md for the rules.
//
// Text fields take inline Markdown: `code`, **bold** and [links](/docs/x).
// Links starting with / are site paths and pick up the base path.
// deploy-pages.sh won't publish while any TODO is left.

import type { SiteConfig } from './src/lib/config.js';

export default {
	name: 'radar',
	description: 'TODO: one sentence a stranger understands. Name the category.',
	repo: 'https://github.com/rynf1t/agent-radar',
	origin: 'https://rynf1t.github.io/radar-site',
	install: 'go install github.com/rynf1t/agent-radar/cmd/radar@latest',
	requirement: 'TODO: what it needs, such as "Needs macOS 15 and Go 1.26 or later."',
	status: 'Early',

	// Hues on the oklch wheel, 0 to 360: 25 red, 75 amber, 150 green,
	// 200 teal, 255 blue, 300 violet. tint nudges the greys, accent is the
	// one colour with jobs. Give each tool its own pair.
	colours: { tint: 60, accent: 240 },

	hero: {
		title: 'TODO: what it does for you, in one line.',
		lead: 'TODO: two sentences. What it is, and the papercut it fixes.',
		// Show the tool working: a screenshot in static/ or a short terminal session.
		code: `# TODO: the first few commands someone runs
radar --help`,
		link: { label: 'Read the docs', href: '/docs' }
	},

	sections: [
		{
			eyebrow: 'TODO',
			title: 'TODO: a short headline for the first thing it does.',
			body: 'TODO: two or three sentences.',
			link: { label: 'Docs', href: '/docs' }
		}
	],

	questions: [
		{
			q: 'Can my agent read these docs?',
			a: 'Yes. Add `.md` to any docs URL, or start at [llms.txt](/llms.txt).'
		}
	]
} satisfies SiteConfig;
