<script lang="ts">
	import { defaultMark } from '#lib/config.js';
	import { href, site } from '#lib/site.js';

	const mark = site.mark ?? defaultMark;
</script>

<a href={href('/')} class="wordmark" aria-label="{site.name} home">
	<!-- The mark comes from our own site.config.ts. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<svg viewBox="0 0 20 20" aria-hidden="true">{@html mark}</svg>
	<span>{site.name}</span>
</a>

<style>
	.wordmark {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		text-decoration: none;
		font-size: 1.0625rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--ink);
	}

	svg {
		width: 20px;
		height: 20px;
	}
</style>
