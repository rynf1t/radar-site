<script lang="ts">
	import { search } from '#lib/search.svelte.js';

	let { wide = false }: { wide?: boolean } = $props();
</script>

<button type="button" class={['trigger', 'edge', { wide }]} onclick={search.show} aria-keyshortcuts="Meta+K">
	<svg viewBox="0 0 16 16" aria-hidden="true">
		<circle cx="7" cy="7" r="4.75" fill="none" stroke="currentColor" stroke-width="1.5" />
		<path d="m10.5 10.5 3.25 3.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	</svg>
	<span>Search</span>
	<kbd>⌘K</kbd>
</button>

<style>
	.trigger {
		--fill: var(--paper);
		display: flex;
		align-items: center;
		gap: 0.45rem;
		height: 2rem;
		padding: 0 0.5rem 0 0.7rem;
		border-radius: 999px;
		color: var(--muted);
		font-size: var(--text-nav);
		transition: color var(--dur-hover);
	}

	.trigger:hover {
		color: var(--soft);
	}

	.trigger:focus-visible {
		--fill: var(--focus-wash);
		color: var(--ink);
		outline-offset: 2px;
	}

	.wide {
		width: 100%;
	}

	svg {
		width: 14px;
		height: 14px;
		flex-shrink: 0;
	}

	span {
		flex: 1;
		text-align: left;
	}

	kbd {
		background: none;
		color: var(--muted);
	}

	@media (hover: none) {
		kbd {
			display: none;
		}
	}
</style>
