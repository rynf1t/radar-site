<script lang="ts">
	import { goto } from '$app/navigation';
	import { search } from '#lib/search.svelte.js';
	import { href } from '#lib/site.js';

	type Entry = { path: string; title: string; page: string; group: string; text: string };
	type Seg = { text: string; hit: boolean };
	type Result = Entry & { titleSegs: Seg[]; excerpt: Seg[]; score: number };

	// Before you type: the first few docs pages.
	const suggestedCount = 4;

	let dialog: HTMLDialogElement | undefined = $state();
	let input: HTMLInputElement | undefined = $state();
	let index: Entry[] = $state.raw([]);
	let query = $state('');
	let active = $state(0);

	const terms = $derived(
		query
			.toLowerCase()
			.split(/\s+/)
			.filter((t) => t.length > 0)
	);

	function segments(text: string, words: string[]): Seg[] {
		if (!words.length) return [{ text, hit: false }];
		const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
		return text
			.split(re)
			.filter(Boolean)
			.map((t) => ({ text: t, hit: words.includes(t.toLowerCase()) }));
	}

	function excerpt(text: string, words: string[]) {
		const lower = text.toLowerCase();
		const at = words.map((w) => lower.indexOf(w)).find((i) => i >= 0) ?? 0;
		const start = Math.max(0, at - 40);
		const cut = text.slice(start, start + 150);
		return segments((start > 0 ? '…' : '') + cut + (start + 150 < text.length ? '…' : ''), words);
	}

	const results: Result[] = $derived.by(() => {
		if (!terms.length) {
			return index
				.filter((e) => !e.path.includes('#'))
				.slice(0, suggestedCount)
				.map((e) => ({ ...e, group: 'Suggested', titleSegs: [{ text: e.title, hit: false }], excerpt: excerpt(e.text, []), score: 0 }));
		}
		const out: Result[] = [];
		for (const e of index) {
			const title = e.title.toLowerCase();
			const hay = `${title} ${e.page.toLowerCase()} ${e.text.toLowerCase()}`;
			if (!terms.every((t) => hay.includes(t))) continue;
			let score = 0;
			for (const t of terms) {
				if (title.startsWith(t)) score += 8;
				else if (title.includes(t)) score += 5;
				if (e.page.toLowerCase().includes(t)) score += 2;
				if (e.text.toLowerCase().includes(t)) score += 1;
			}
			out.push({ ...e, titleSegs: segments(e.title, terms), excerpt: excerpt(e.text, terms), score });
		}
		return out.sort((a, b) => b.score - a.score).slice(0, 12);
	});

	// Results keep their rank but are shown under their group, in order of each group's best result.
	const groups = $derived.by(() => {
		const map = new Map<string, Result[]>();
		for (const r of results) map.set(r.group, [...(map.get(r.group) ?? []), r]);
		return [...map.entries()];
	});
	const flat = $derived(groups.flatMap(([, rs]) => rs));

	async function loadIndex() {
		if (index.length) return;
		const res = await fetch(href('/search.json'));
		index = await res.json();
	}

	function open() {
		if (!dialog || dialog.open) return;
		loadIndex();
		dialog.showModal();
		input?.focus();
	}

	function close() {
		dialog?.close();
	}

	$effect(() => {
		if (search.open) open();
		else close();
	});

	function choose(r: Result | undefined) {
		if (!r) return;
		search.hide();
		goto(href(r.path));
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) {
			e.preventDefault();
			active = Math.min(active + 1, flat.length - 1);
			scrollActive();
		} else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) {
			e.preventDefault();
			active = Math.max(active - 1, 0);
			scrollActive();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			choose(flat[active]);
		}
	}

	function scrollActive() {
		requestAnimationFrame(() => dialog?.querySelector(`#search-result-${active}`)?.scrollIntoView({ block: 'nearest' }));
	}

	// Esc unwinds one layer: clear the query first, then close.
	function oncancel(e: Event) {
		if (query) {
			e.preventDefault();
			query = '';
			active = 0;
		} else {
			search.hide();
		}
	}

	function onwindowkey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			if (search.open) search.hide();
			else search.show();
		}
	}
</script>

<svelte:window onkeydown={onwindowkey} />

<dialog
	bind:this={dialog}
	class="search"
	aria-label="Search the docs"
	{oncancel}
	onclose={() => {
		search.hide();
		query = '';
		active = 0;
	}}
	onclick={(e) => {
		if (e.target === dialog) search.hide();
	}}
>
	<div class="bar">
		<svg viewBox="0 0 16 16" aria-hidden="true" class="glass">
			<circle cx="7" cy="7" r="4.75" fill="none" stroke="currentColor" stroke-width="1.5" />
			<path d="m10.5 10.5 3.25 3.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
		</svg>
		<input
			bind:this={input}
			bind:value={query}
			oninput={() => (active = 0)}
			{onkeydown}
			type="text"
			placeholder="Search the docs"
			autocomplete="off"
			spellcheck="false"
			role="combobox"
			aria-expanded="true"
			aria-controls="search-results"
			aria-autocomplete="list"
			aria-activedescendant={flat.length ? `search-result-${active}` : undefined}
		/>
		<button type="button" class="esc" aria-label="Close search" onclick={() => search.hide()}>esc</button>
	</div>

	<div id="search-results" class="results" role="listbox" aria-label="Results">
		{#if terms.length && !flat.length}
			<p class="empty">No matches for “{query}”. Try a command or a state, such as <kbd>focus</kbd> or <kbd>blocked</kbd>.</p>
		{/if}
		{#each groups as [label, rs], gi (label)}
			<div role="group" aria-labelledby="search-group-{gi}">
				<p id="search-group-{gi}" class="group">{label}</p>
				{#each rs as r (r.path)}
					{@const i = flat.indexOf(r)}
					<a
						id="search-result-{i}"
						role="option"
						aria-selected={i === active}
						class="item"
						href={href(r.path)}
						onclick={(e) => {
							e.preventDefault();
							choose(r);
						}}
						onmousemove={() => (active = i)}
						tabindex="-1"
					>
						<span class="text">
							<span class="title">
								{#each r.titleSegs as s, si (si)}{#if s.hit}<mark>{s.text}</mark>{:else}{s.text}{/if}{/each}
								{#if r.title !== r.page}<span class="page">{r.page}</span>{/if}
							</span>
							<span class="excerpt">
								{#each r.excerpt as s, si (si)}{#if s.hit}<mark>{s.text}</mark>{:else}{s.text}{/if}{/each}
							</span>
						</span>
						<span class="enter" aria-hidden="true">↵</span>
					</a>
				{/each}
			</div>
		{/each}
	</div>
</dialog>

<style>
	.search {
		margin: 12vh auto auto;
		width: min(34rem, calc(100vw - 2rem));
		max-height: min(36rem, 76vh);
		padding: 0;
		border: 0;
		border-radius: var(--radius-dialog);
		background: var(--surface);
		color: var(--ink);
		box-shadow: var(--shadow-dialog);
		overflow: hidden;
		flex-direction: column;
		transition:
			box-shadow 220ms ease-out,
			opacity 120ms ease-out,
			translate 220ms var(--ease-out-expo),
			overlay 220ms allow-discrete,
			display 220ms allow-discrete;
	}

	.search[open] {
		display: flex;
	}

	/* Withhold the shadow until the dialog has landed. */
	@starting-style {
		.search[open] {
			box-shadow: none;
			opacity: 0;
			translate: 0 -6px;
		}
	}

	.search::backdrop {
		background: var(--backdrop);
	}

	@media (prefers-reduced-motion: reduce) {
		.search {
			transition: none;
		}
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0 1.1rem;
		border-bottom: 1px solid var(--rule);
	}

	.glass {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		color: var(--muted);
	}

	input {
		flex: 1;
		min-width: 0;
		height: 3.25rem;
		border: 0;
		outline: 0;
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 1.3125rem;
		letter-spacing: -0.01em;
	}

	input::placeholder {
		color: var(--muted);
	}

	.esc {
		color: var(--muted);
		font-size: 1rem;
		transition: color var(--dur-hover);
	}

	.esc:hover {
		color: var(--soft);
	}

	.results {
		overflow-y: auto;
		overscroll-behavior: contain;
		scroll-padding-block: 0.5rem;
		padding: 0.25rem 0.5rem 0.5rem;
		scrollbar-width: thin;
	}

	.group {
		padding: 0.75rem 0.75rem 0.35rem;
		color: var(--muted);
		font-size: 0.75rem;
	}

	.item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.6rem 0.75rem;
		border-radius: var(--radius-panel);
		text-decoration: none;
		outline: none;
	}

	.item[aria-selected='true'] {
		background: var(--hover);
	}

	.text {
		flex: 1;
		min-width: 0;
	}

	.title {
		display: block;
		font-size: 0.9375rem;
		line-height: 1.35;
		letter-spacing: -0.01em;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.page {
		color: var(--muted);
		margin-left: 0.4rem;
		font-size: 0.8125rem;
	}

	.excerpt {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		padding-top: 0.15rem;
		color: var(--soft);
		font-size: 0.8125rem;
		line-height: 1.45;
	}

	mark {
		background: var(--mark);
		color: var(--ink);
		border-radius: 3px;
		padding: 0 1px;
	}

	.enter {
		margin-top: 0.3rem;
		color: var(--muted);
		font-size: 0.75rem;
		visibility: hidden;
	}

	.item[aria-selected='true'] .enter {
		visibility: visible;
	}

	.empty {
		padding: 1.25rem 0.75rem;
		color: var(--muted);
		font-size: var(--text-nav);
	}
</style>
