<script lang="ts">
	import { hasChangelog, href, site } from '#lib/site.js';
</script>

<footer class="footer">
	<a href={href('/docs')}>Docs</a>
	{#each site.nav ?? [] as l (l.href)}<a href={href(l.href)}>{l.label}</a>{/each}
	{#if hasChangelog}<a href={href('/changelog')}>Changelog</a>{/if}
	<span class="rule" aria-hidden="true"></span>
	<a href={href('/llms.txt')} data-sveltekit-reload>llms.txt</a>
	<a href={site.repo}>GitHub</a>
	{#if site.author}<a href={site.author.href}>{site.author.label}</a>{/if}
</footer>

<style>
	.footer {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		max-width: 72rem;
		margin: 0 auto;
		padding: 2rem var(--gutter) 2.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.rule {
		flex: 1;
		height: 1px;
		background: var(--rule);
	}

	a {
		color: var(--muted);
		text-decoration: none;
		transition: color var(--dur-hover);
	}

	a:hover {
		color: var(--ink);
	}
</style>
