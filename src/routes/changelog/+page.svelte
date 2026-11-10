<script lang="ts">
	import { href, site } from '#lib/site.js';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Changelog · {site.name}</title>
	<meta name="description" content="What changed in {site.name}, newest first." />
	<link rel="alternate" type="text/markdown" href={href('/changelog.md')} title="Markdown" />
</svelte:head>

<SiteHeader />

<main>
	<h1>Changelog</h1>
	<ol class="entries">
		{#each data.entries as e (e.path)}
			<li>
				<p class="date"><time>{e.date}</time></p>
				<h2><a href={href(e.path)}>{e.title}</a></h2>
				{#if e.version}<p class="version">{e.version}</p>{/if}
				<!-- Rendered at build time from our own Markdown in content/changelog. -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<div class="lead">{@html e.lead}</div>
				<a class="more" href={href(e.path)}>Read the full post</a>
			</li>
		{/each}
	</ol>
</main>

<SiteFooter />

<style>
	main {
		max-width: calc(var(--measure) + 2 * var(--gutter));
		margin: 0 auto;
		padding: 4rem var(--gutter) 5rem;
	}

	h1 {
		font-size: var(--text-title);
		letter-spacing: -0.02em;
		padding-bottom: 2.5rem;
	}

	.entries {
		list-style: none;
		display: grid;
		gap: 3.5rem;
	}

	.date {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	h2 {
		font-size: var(--text-heading);
		letter-spacing: -0.015em;
		padding-top: 0.5rem;
	}

	h2 a {
		color: var(--ink);
		text-decoration: none;
	}

	.version {
		color: var(--muted);
		font-size: var(--text-small);
		padding-top: 0.15rem;
	}

	.lead {
		color: var(--soft);
		font-size: 1.0625rem;
		line-height: 1.55;
		padding: 0.75rem 0;
	}

	.lead :global(p) {
		margin: 0;
	}

	.lead :global(a),
	.more {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--faint);
		text-underline-offset: 3px;
	}

	.more {
		font-size: var(--text-nav);
	}
</style>
