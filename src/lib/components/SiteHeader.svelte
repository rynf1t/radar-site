<script lang="ts">
	import { page } from '$app/state';
	import { hasChangelog, href, site } from '#lib/site.js';
	import Wordmark from './Wordmark.svelte';
	import SearchTrigger from './SearchTrigger.svelte';
	import ModeToggle from './ModeToggle.svelte';

	const links = [
		{ href: '/docs', label: 'Docs', match: '/docs' },
		...(site.nav ?? []).map((l) => ({ ...l, match: l.href })),
		...(hasChangelog ? [{ href: '/changelog', label: 'Changelog', match: '/changelog' }] : [])
	];
</script>

<header class="header">
	<Wordmark />
	<nav aria-label="Site">
		{#each links as l (l.href)}
			<a href={href(l.href)} aria-current={page.url.pathname.startsWith(href(l.match)) ? 'page' : undefined}>{l.label}</a>
		{/each}
		<a href={site.repo} class="gh">GitHub</a>
		<SearchTrigger />
		<ModeToggle />
	</nav>
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		max-width: 72rem;
		margin: 0 auto;
		padding: 1.75rem var(--gutter) 0;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 1.4rem;
		font-size: var(--text-nav);
	}

	a {
		color: var(--soft);
		text-decoration: none;
		transition: color var(--dur-hover);
	}

	a:hover,
	a[aria-current='page'] {
		color: var(--ink);
	}

	@media (max-width: 40rem) {
		nav {
			gap: 1rem;
		}
		.gh {
			display: none;
		}
	}
</style>
