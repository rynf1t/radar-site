<script lang="ts">
	let { command }: { command: string } = $props();
	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		await navigator.clipboard.writeText(command);
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1400);
	}
</script>

<div class="line edge">
	<code><span class="prompt" aria-hidden="true">$</span>{command}</code>
	<button type="button" onclick={copy} aria-label={copied ? 'Copied' : 'Copy the install command'}>
		{#if copied}
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>
			<span>Copied</span>
		{:else}
			<svg viewBox="0 0 16 16" aria-hidden="true">
				<rect x="5.5" y="5.5" width="8" height="8" rx="2" />
				<path d="M10.5 3.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3.5V9A1.5 1.5 0 0 0 4 10.5" />
			</svg>
			<span>Copy</span>
		{/if}
	</button>
</div>

<style>
	.line {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		max-width: 100%;
		padding: 0.35rem 0.35rem 0.35rem 1rem;
		border-radius: 999px;
		box-shadow: var(--shadow-surface);
	}

	code {
		flex: 1 1 0;
		width: 0;
		min-width: 0;
		overflow-x: auto;
		white-space: nowrap;
		scrollbar-width: none;
		font-size: 0.8125rem;
		color: var(--ink);
		mask-image: linear-gradient(to right, black calc(100% - 1.5rem), transparent);
	}

	.prompt {
		color: var(--muted);
		margin-right: 0.6em;
		user-select: none;
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		height: 2rem;
		padding: 0 0.85rem;
		border-radius: 999px;
		background: var(--ink);
		color: var(--paper);
		font-size: var(--text-small);
		flex-shrink: 0;
		transition: opacity var(--dur-hover);
	}

	button:hover {
		opacity: 0.88;
	}

	svg {
		width: 14px;
		height: 14px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
