<script lang="ts">
	import { href, site } from '#lib/site.js';
	import { copyButtons } from '#lib/copy.js';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const e = $derived(data.entry);
</script>

<svelte:head>
	<title>{e.title} · {site.name} changelog</title>
	<meta name="description" content={e.description} />
	<link rel="alternate" type="text/markdown" href={href(`${e.path}.md`)} title="Markdown" />
</svelte:head>

<SiteHeader />

<main {@attach copyButtons}>
	<p class="back"><a href={href('/changelog')}>Changelog</a></p>
	<p class="date"><time>{e.date}</time></p>
	<h1>{e.title}</h1>
	{#if e.version}<p class="version">{e.version}</p>{/if}
	<div class="prose">
		<!-- Rendered at build time from our own Markdown in content/changelog. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html e.html}
	</div>
	<p class="md"><a href={href(`${e.path}.md`)} data-sveltekit-reload>This post as Markdown</a></p>
</main>

<SiteFooter />

<style>
	main {
		max-width: calc(var(--measure) + 2 * var(--gutter));
		margin: 0 auto;
		padding: 4rem var(--gutter) 5rem;
	}

	.back a,
	.md a {
		color: var(--muted);
		text-decoration: none;
		font-size: var(--text-nav);
		transition: color var(--dur-hover);
	}

	.back a::before {
		content: '← ';
	}

	.back a:hover,
	.md a:hover {
		color: var(--ink);
	}

	.date {
		padding-top: 2rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		color: var(--muted);
	}

	h1 {
		font-size: var(--text-title);
		letter-spacing: -0.02em;
		line-height: 1.15;
		padding-top: 0.5rem;
	}

	.version {
		color: var(--muted);
		font-size: var(--text-small);
		padding-top: 0.25rem;
	}

	.prose {
		padding-top: 1.5rem;
	}

	.md {
		margin-top: 3rem;
		font-family: var(--font-mono);
	}

	.md a {
		font-size: 0.75rem;
	}
</style>
