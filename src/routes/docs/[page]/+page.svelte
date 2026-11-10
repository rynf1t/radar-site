<script lang="ts">
	import { href, site } from '#lib/site.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const doc = $derived(data.doc);
</script>

<svelte:head>
	<title>{doc.title} · {site.name} docs</title>
	<meta name="description" content={doc.description} />
	<link rel="alternate" type="text/markdown" href={href(`${doc.path}.md`)} title="Markdown" />
</svelte:head>

<article class="article">
	<p class="crumb">{doc.group}</p>
	<h1>{doc.title}</h1>
	<div class="prose">
		<!-- Rendered at build time from our own Markdown in content/docs. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html doc.html}
	</div>

	<footer class="foot">
		<nav class="pager" aria-label="Previous and next page">
			{#if data.prev}
				<a href={href(data.prev.path)} class="prev"><span class="dir">Previous</span>{data.prev.title}</a>
			{/if}
			{#if data.next}
				<a href={href(data.next.path)} class="next"><span class="dir">Next</span>{data.next.title}</a>
			{/if}
		</nav>
		<p class="md">
			<a href={href(`${doc.path}.md`)} data-sveltekit-reload>This page as Markdown</a>
		</p>
	</footer>
</article>

<style>
	.article {
		max-width: var(--measure);
	}

	.crumb {
		color: var(--muted);
		font-size: var(--text-nav);
		padding-top: 4.25rem;
		padding-bottom: 0.35rem;
	}

	h1 {
		font-size: var(--text-title);
		line-height: 1.15;
		letter-spacing: -0.02em;
		padding-bottom: 1.25rem;
	}

	@media (max-width: 52rem) {
		.crumb {
			padding-top: 1rem;
		}
	}

	.foot {
		margin-top: 4rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--rule);
	}

	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.pager a {
		display: grid;
		gap: 0.15rem;
		padding: 0.6rem 0.75rem;
		margin: -0.6rem -0.75rem;
		border-radius: var(--radius-panel);
		text-decoration: none;
		color: var(--ink);
		transition: background-color var(--dur-hover);
	}

	.pager a:hover {
		background: var(--wash);
	}

	.next {
		grid-column: 2;
		text-align: right;
	}

	.dir {
		color: var(--muted);
		font-size: var(--text-small);
	}

	.md {
		margin-top: 2.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.md a {
		color: var(--muted);
		text-decoration: none;
		transition: color var(--dur-hover);
	}

	.md a:hover {
		color: var(--ink);
	}
</style>
