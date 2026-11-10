// Everything that makes this site about radar. The landing page, its
// Markdown twin, llms.txt, the header, the favicon and the colours all come
// from here. Docs pages live in content/docs. See AGENTS.md for the rules.
//
// Text fields take inline Markdown: `code`, **bold** and [links](/docs/x).
// Links starting with / are site paths and pick up the base path.

import type { SiteConfig } from './src/lib/config.js';

export default {
	name: 'radar',
	description: 'radar shows every coding agent across your Rex sessions in one pane, ordered by who needs you. Enter jumps there.',
	repo: 'https://github.com/rynf1t/agent-radar',
	origin: 'https://radar.itsryan.me',
	install: 'go install github.com/rynf1t/agent-radar/cmd/radar@latest',
	requirement: 'Needs Rex Beta 0.1 on macOS and Go 1.26 or later.',
	status: 'Early, for Rex on macOS',

	// Cool slate greys and an amber accent, the colours the pane itself uses.
	colours: { tint: 255, accent: 75 },

	mark: `<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".28"/><circle cx="10" cy="10" r="4.4" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".55"/><circle cx="10" cy="10" r="2.2" fill="var(--accent)"/>`,

	hero: {
		title: 'Every coding agent in one pane, ordered by who needs you.',
		lead: 'radar watches your Rex sessions and lists every agent by urgency. The one waiting on a permission sits at the top, finished work stays marked until you look, and Enter takes you there.',
		link: { label: 'Read the quick start', href: '/docs/quick-start' }
	},

	sections: [
		{
			eyebrow: 'What it shows',
			title: 'Blocked first, then everything else.',
			body: "Agents report their own state through Rex's [program status protocol](https://www.superlogical.com/rex/docs/build/program-status), so radar never has to guess. It sorts by urgency, then by how long each agent has waited.",
			link: { label: 'States in detail', href: '/docs/states' },
			items: [
				{ name: 'blocked', text: 'Waiting on you: a permission, a question or a login' },
				{ name: 'error', text: 'Failed and stopped' },
				{ name: 'done', text: "Finished, and you haven't looked yet. Once you have, it drops to the bottom." },
				{ name: 'working', text: 'Busy. The ring fills if the agent reports progress.' },
				{ name: 'idle', text: 'Waiting for its next instruction' }
			]
		},
		{
			eyebrow: 'Jump',
			title: 'Enter takes you there.',
			body: "radar focuses the agent's pane, then asks Rex to show its session. Keep it open beside you with `radar show`, or add the Rex plugin and float it over any session with Cmd+Shift+U. Jumping needs Remote Control, which you turn on in Rex Settings under Rex Server.",
			link: { label: 'Quick start', href: '/docs/quick-start' },
			items: [
				{ name: '↑ ↓', text: 'Move, or j and k' },
				{ name: 'enter', text: "Jump to that agent's pane" },
				{ name: '/', text: 'Filter by session, title, message, state or folder' },
				{ name: '⌘ ⇧ U', text: 'Float the radar over any session, with the Rex plugin' },
				{ name: 'q', text: 'Quit' }
			]
		},
		{
			eyebrow: 'Toasts',
			title: 'A nudge from the sessions you’re not in.',
			body: 'Rex only sends notifications while it’s in the background. `radar watch` covers the rest: when an agent in another session gets blocked, fails or finishes, a small card shows in the corner of the tab you’re on. Click it to jump there.',
			link: { label: 'Set up toasts', href: '/docs/quick-start#toasts-from-other-sessions' },
			code: `# toasts while you work in Rex
radar watch

# only for agents that are stuck
radar watch --states blocked,error`
		},
		{
			eyebrow: 'Scripts and agents',
			title: 'The same list, as JSON.',
			body: 'Every command exits with a code a script can branch on: 0 ok, 1 failed, 2 usage, 3 not found, 4 Rex unreachable. The agent skill ships inside the binary, so it always matches the version you run.',
			link: { label: 'Read this, agents', href: '/docs/agents' },
			code: `# anything waiting on me?
radar ls --state blocked --json | jq -r '.agents[] | "\\(.session): \\(.msg)"'

# jump to whatever needs me
radar focus

# teach Claude Code to use it
radar skill install`
		},
		{
			eyebrow: 'Built on craftkit',
			title: 'Four small packages every tool needs.',
			body: "radar's colours, exit codes, skill installer and status reports live in craftkit, so the next tool starts from the same place.",
			link: { label: 'About craftkit', href: '/docs/craftkit' },
			items: [
				{ name: 'termcolor', text: 'Asks the terminal for its colours and mixes greys from them' },
				{ name: 'cliout', text: 'One exit code table, and JSON that suits whoever reads it' },
				{ name: 'skillkit', text: "Installs the embedded agent skill and never touches a file it didn't write" },
				{ name: 'status', text: 'Writes OSC 7501 reports so Rex knows what your tool is doing' }
			]
		}
	],

	questions: [
		{
			q: 'What does it need?',
			a: 'Rex Beta 0.1 on macOS, Go 1.26 to install it, and Remote Control turned on if you want Enter to jump.'
		},
		{
			q: 'How early is it?',
			a: 'In daily use by one person. The CLI and the JSON shape may still change.'
		},
		{
			q: 'Does it see agents on other machines?',
			a: 'Not yet. radar reads the local Rex server, so it shows agents on this Mac.'
		},
		{
			q: 'Can my agent read these docs?',
			a: 'Yes. Add `.md` to any docs URL, or start at [llms.txt](/llms.txt).'
		}
	],

	nav: [{ label: 'craftkit', href: '/docs/craftkit' }]
} satisfies SiteConfig;
