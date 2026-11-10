<script lang="ts">
	// A short code sample from site.config.ts. Lines starting with # are
	// comments. In a terminal sample, the first word of a command is the program.
	let { code, terminal = false }: { code: string; terminal?: boolean } = $props();

	const lines = $derived(
		code.split('\n').map((line) => {
			if (line.trimStart().startsWith('#')) return { comment: line };
			if (!terminal || !line.trim()) return { rest: line };
			const m = line.match(/^(\s*)(\S+)(.*)$/)!;
			return { lead: m[1], program: m[2], rest: m[3] };
		})
	);
</script>

<pre class={['edge', { terminal }]}><code
		>{#each lines as l, i (i)}{#if l.comment !== undefined}<span class="c">{l.comment}</span
				>{:else}{l.lead ?? ''}{#if l.program}<span class="f">{l.program}</span>{/if}{l.rest}{/if}{'\n'}{/each}</code
	></pre>

<style>
	pre {
		overflow-x: auto;
		min-width: 0;
		padding: 1rem 1.1rem;
		border-radius: var(--radius-panel);
		box-shadow: var(--shadow-surface);
		font-size: 0.8125rem;
		line-height: 1.65;
		color: var(--ink);
		scrollbar-width: thin;
	}

	.terminal {
		padding: 1.25rem 1.4rem;
		border-radius: var(--radius-frame);
		box-shadow: var(--shadow-raised);
		font-size: 0.875rem;
	}

	.c {
		color: var(--sh-com);
	}

	.f {
		color: var(--sh-fn);
	}
</style>
