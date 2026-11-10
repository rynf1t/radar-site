<script lang="ts">
	import { page } from '$app/state';
	import { search } from '#lib/search.svelte.js';
	import { href, site } from '#lib/site.js';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Not found' : 'Error'} · {site.name}</title>
</svelte:head>

<SiteHeader />

<main>
	<p class="code">{page.status}</p>
	{#if page.status === 404}
		<h1>Nothing lives at {page.url.pathname}.</h1>
		<p>The page may have moved when the docs were reorganised. Search usually finds it.</p>
	{:else}
		<h1>Something went wrong.</h1>
		<p>{page.error?.message}</p>
	{/if}
	<div class="actions">
		<button type="button" class="primary" onclick={search.show}>Search the docs <kbd>⌘K</kbd></button>
		<a href={href('/')}>Go home</a>
	</div>
</main>

<SiteFooter />

<style>
	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 8rem var(--gutter) 6rem;
		min-height: calc(100dvh - 12rem);
		align-content: start;
		display: grid;
		gap: 1rem;
		justify-items: start;
	}

	.code {
		font-family: var(--font-mono);
		color: var(--muted);
		font-size: var(--text-small);
	}

	h1 {
		font-size: var(--text-title);
		letter-spacing: -0.02em;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	p {
		color: var(--soft);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-top: 0.75rem;
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		height: 2.25rem;
		padding: 0 1rem;
		border-radius: 999px;
		background: var(--ink);
		color: var(--paper);
		font-size: var(--text-nav);
	}

	.primary kbd {
		background: color-mix(in oklab, var(--paper) 18%, transparent);
		color: var(--paper);
	}

	a {
		color: var(--soft);
		font-size: var(--text-nav);
	}
</style>
