<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import type { Attachment } from 'svelte/attachments';
	import { initial, script, order, ago, label, type Agent, type State } from './demo.js';

	const STEP_MS = 2600;
	const reduced = new MediaQuery('(prefers-reduced-motion: reduce)');
	const dur = $derived(reduced.current ? 0 : 150);

	let agents: Agent[] = $state(initial.map((a) => ({ ...a })));
	let step = $state(0);
	let now = $state(0);
	let selected = $state('c');
	let paused = $state(false);
	let visible = $state(false);
	let engaged = $state(false); // pointer over or focus inside: hold still while someone reads
	let toast = $state('');

	type Item = { key: string; kind: 'header'; label: string } | { key: string; kind: 'row'; agent: Agent };

	const ordered = $derived(order(agents));
	const items: Item[] = $derived.by(() => {
		const out: Item[] = [];
		let last = '';
		for (const a of ordered) {
			if (a.session !== last) out.push({ key: `s:${a.session}`, kind: 'header', label: a.session });
			out.push({ key: a.id, kind: 'row', agent: a });
			last = a.session;
		}
		return out;
	});
	const ids = $derived(ordered.map((a) => a.id));

	const counts = $derived.by(() => {
		const c: Record<State, number> = { blocked: 0, error: 0, done: 0, working: 0, idle: 0 };
		for (const a of agents) c[a.state]++;
		return c;
	});

	function advance() {
		const change = script[step];
		if (!change) {
			agents = initial.map((a) => ({ ...a }));
			now = 0;
			step = 0;
			return;
		}
		now += change.mins;
		const { id, mins, ...rest } = change;
		agents = agents.map((a) => {
			if (a.id !== id) return a;
			const next = { ...a, ...rest };
			if (rest.state && rest.state !== a.state) next.since = now;
			if (next.state !== 'working') next.progress = undefined;
			return next;
		});
		step++;
	}

	const running = $derived(visible && !paused && !engaged);

	$effect(() => {
		if (!running) return;
		const t = setInterval(advance, STEP_MS);
		return () => clearInterval(t);
	});

	const onScreen: Attachment<HTMLElement> = (node) => {
		const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
		io.observe(node);
		return () => io.disconnect();
	};

	// The selection glides to its row: one highlight, moved to the row's box.
	let rowEls: Record<string, HTMLElement> = {};
	let hl = $state({ y: 0, h: 0, ready: false });
	$effect(() => {
		void items;
		const el = rowEls[selected];
		if (el) hl = { y: el.offsetTop, h: el.offsetHeight, ready: true };
	});

	function move(by: number) {
		const i = ids.indexOf(selected);
		selected = ids[Math.max(0, Math.min(ids.length - 1, (i < 0 ? 0 : i) + by))];
	}

	let toastTimer: ReturnType<typeof setTimeout> | undefined;
	function jump(id = selected) {
		const a = agents.find((x) => x.id === id);
		if (!a) return;
		selected = id;
		toast = `Jumped to ${a.session}`;
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => (toast = ''), 1600);
	}

	function onkeydown(e: KeyboardEvent) {
		const k = e.key;
		if (k === 'ArrowDown' || k === 'j') move(1);
		else if (k === 'ArrowUp' || k === 'k') move(-1);
		else if (k === 'g') selected = ids[0];
		else if (k === 'G') selected = ids[ids.length - 1];
		else if (k === 'Enter') jump();
		else return;
		e.preventDefault();
	}

	const ringPath = (p: number) => {
		const r = 2.6;
		const a = Math.min(p, 0.999) * 2 * Math.PI;
		const x = 6 + r * Math.sin(a);
		const y = 6 - r * Math.cos(a);
		return `M6 6 L6 ${6 - r} A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x} ${y} Z`;
	};
</script>

<figure class="frame" {@attach onScreen} aria-label="A live demo of the radar pane with five fictional agents">
	<div class="chrome">
		<span class="who"><span class="dot" aria-hidden="true"></span>radar</span>
		<span class="path">~/work</span>
		<button
			type="button"
			class="pause"
			onclick={() => (paused = !paused)}
			aria-label={paused ? 'Play the demo' : 'Pause the demo'}
			aria-pressed={paused}
		>
			{#if paused}
				<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 2.2v7.6L9.6 6z" fill="currentColor" /></svg>
			{:else}
				<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 2.5v7M8.5 2.5v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
			{/if}
		</button>
	</div>

	<div
		class="pane"
		role="listbox"
		tabindex="0"
		aria-label="Agents, most urgent first"
		aria-activedescendant="demo-{selected}"
		{onkeydown}
		onpointerenter={() => (engaged = true)}
		onpointerleave={() => (engaged = false)}
		onfocusin={() => (engaged = true)}
		onfocusout={() => (engaged = false)}
	>
		<p class="summary" aria-live="off">
			{#if counts.blocked}<span class="t-blocked">{counts.blocked} {counts.blocked === 1 ? 'needs' : 'need'} you</span>{/if}
			{#if counts.error}<span class="t-error">{counts.error} failed</span>{/if}
			{#if counts.done}<span class="t-done">{counts.done} done</span>{/if}
			{#if counts.working}<span>{counts.working} working</span>{/if}
			{#if counts.idle}<span class="t-faint">{counts.idle} idle</span>{/if}
			{#if !agents.length}<span class="t-faint">No agents</span>{/if}
		</p>

		<div class="list">
			<div
				class="hl"
				style:translate="0 {hl.y}px"
				style:height="{hl.h}px"
				style:opacity={hl.ready ? 1 : 0}
				style:transition-duration="{dur}ms"
				aria-hidden="true"
			></div>
			{#each items as it (it.key)}
				<div class="item" bind:this={rowEls[it.key]} animate:flip={{ duration: dur, easing: expoOut }} transition:fade={{ duration: dur }}>
					{#if it.kind === 'header'}
						<p class="header" role="presentation">{it.label}</p>
					{:else}
						{@const a = it.agent}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							id="demo-{a.id}"
							class="row"
							role="option"
							tabindex="-1"
							aria-selected={selected === a.id}
							aria-label="{a.session}, {a.title}, {label(a)}{a.msg ? `: ${a.msg}` : ''}"
							onclick={() => jump(a.id)}
						>
							<span class="glyph" aria-hidden="true">
								{#if a.state === 'working'}
									<svg viewBox="0 0 12 12">
										<circle cx="6" cy="6" r="4.4" fill="none" stroke="var(--st-ring)" stroke-width="1.4" />
										{#if a.progress}<path d={ringPath(a.progress)} fill="var(--st-ring)" />{/if}
									</svg>
								{:else}
									<span class={['dot', a.state]}></span>
								{/if}
							</span>
							<span class="line1">
								<span class="title">{a.title}</span>
								<span class="ago">{ago(now, a.since)}</span>
							</span>
							<span class="line2">
								<span class="state t-{a.state}">{label(a)}</span>
								{#if a.msg}<span class="msg">{a.msg}</span>{/if}
							</span>
							<span class="line3">{a.app}<span class="folder">{a.folder}</span></span>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<p class="hint">
			{#if toast}
				<span class="toast" transition:fade={{ duration: dur }}>{toast}</span>
			{:else}
				<span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>enter</kbd> jump</span>
			{/if}
		</p>
	</div>
</figure>

<style>
	.frame {
		--sel: color-mix(in oklab, var(--st-done) 14%, var(--surface));
		position: relative;
		width: 100%;
		max-width: 26rem;
		border-radius: var(--radius-frame);
		background: var(--surface);
		box-shadow: var(--shadow-raised);
		overflow: hidden;
		font-size: 15px;
	}

	.chrome {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		height: 2.5rem;
		padding: 0 0.6rem 0 0.9rem;
		border-bottom: 1px solid var(--rule);
		font-size: var(--text-small);
	}

	.who {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--ink);
	}

	.who .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
	}

	.path {
		flex: 1;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.pause {
		width: 1.75rem;
		height: 1.75rem;
		display: grid;
		place-items: center;
		border-radius: 999px;
		color: var(--muted);
		transition:
			color var(--dur-hover),
			background-color var(--dur-hover);
	}

	.pause:hover {
		color: var(--ink);
		background: var(--wash);
	}

	.pause svg {
		width: 12px;
		height: 12px;
	}

	.pane {
		padding: 0.75rem 0.875rem 0.5rem;
		outline: none;
	}

	.pane:focus-visible {
		box-shadow: inset 0 0 0 2px var(--focus);
		border-radius: 0 0 var(--radius-frame) var(--radius-frame);
	}

	.summary {
		display: flex;
		gap: 0.6rem;
		min-height: 1.6rem;
		color: var(--soft);
		font-size: 0.8125rem;
		white-space: nowrap;
		overflow: hidden;
	}

	.list {
		position: relative;
		min-height: 25.5rem;
	}

	.hl {
		position: absolute;
		z-index: 0;
		inset-inline: -0.375rem;
		top: 0;
		border-radius: 8px;
		background: var(--sel);
		transition-property: translate, height, opacity;
		transition-timing-function: var(--ease-out-expo);
	}

	.item {
		position: relative;
		z-index: 1;
	}

	.header {
		padding: 0.75rem 0 0.25rem;
		color: var(--muted);
		font-size: 0.75rem;
	}

	.row {
		display: grid;
		grid-template-columns: 1.25rem 1fr;
		column-gap: 0.1rem;
		padding: 0.45rem 0;
		cursor: pointer;
		line-height: 1.35;
	}

	.glyph {
		grid-row: 1;
		display: grid;
		place-items: center;
		width: 12px;
		height: 1.35em;
	}

	.glyph svg {
		width: 12px;
		height: 12px;
	}

	.glyph .dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}

	.dot.blocked {
		background: var(--st-blocked);
	}
	.dot.error {
		background: var(--st-error);
	}
	.dot.done {
		background: var(--st-done);
	}
	.dot.idle {
		width: 6px;
		height: 6px;
		background: var(--st-idle);
	}

	.line1,
	.line2,
	.line3 {
		grid-column: 2;
		display: flex;
		gap: 0.4rem;
		min-width: 0;
		white-space: nowrap;
	}

	.title {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--ink);
		font-size: 0.9375rem;
	}

	.ago {
		color: var(--muted);
		font-size: 0.8125rem;
		font-variant-numeric: tabular-nums;
	}

	.line2 {
		font-size: 0.8125rem;
	}

	.msg {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--soft);
	}

	.line3 {
		color: var(--muted);
		font-size: 0.8125rem;
	}

	.folder {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.state {
		color: var(--soft);
	}

	.t-blocked {
		color: var(--accent-ink);
	}
	.t-error {
		color: var(--st-error);
	}
	.t-done {
		color: var(--st-done);
	}
	.t-faint,
	.t-idle {
		color: var(--muted);
	}

	.hint {
		display: flex;
		justify-content: center;
		gap: 1rem;
		min-height: 2.25rem;
		align-items: center;
		color: var(--muted);
		font-size: 0.75rem;
	}

	.hint kbd {
		margin-right: 0.2rem;
		font-size: 0.6875rem;
	}

	.toast {
		color: var(--ink);
	}
</style>
