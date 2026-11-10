<script lang="ts">
	// Flips between light and dark and remembers the choice. Until the reader
	// clicks, the page follows the system (see the script in app.html).
	let mode = $state<'light' | 'dark'>('light');

	$effect(() => {
		mode = document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light';
	});

	function toggle() {
		mode = mode === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.mode = mode;
		try {
			localStorage.setItem('toolsite-mode', mode);
		} catch {
			// Private windows can refuse storage. The switch still works for this page.
		}
	}
</script>

<button type="button" class="mode" onclick={toggle} aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
	<svg viewBox="0 0 16 16" aria-hidden="true">
		{#if mode === 'dark'}
			<circle cx="8" cy="8" r="3" />
			<path d="M8 1.5v1.25M8 13.25v1.25M1.5 8h1.25M13.25 8h1.25M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
		{:else}
			<path d="M13.5 9.6A5.75 5.75 0 0 1 6.4 2.5a5.75 5.75 0 1 0 7.1 7.1Z" />
		{/if}
	</svg>
</button>

<style>
	.mode {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		flex: none;
		border-radius: 999px;
		color: var(--muted);
		transition:
			color var(--dur-hover),
			background-color var(--dur-hover);
	}

	.mode:hover {
		color: var(--ink);
		background: var(--wash);
	}

	svg {
		width: 16px;
		height: 16px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
