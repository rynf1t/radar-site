<script lang="ts">
	import { href, site } from '#lib/site.js';
	import SiteHeader from '#lib/components/SiteHeader.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import CopyLine from '#lib/components/CopyLine.svelte';
	import CodeSample from '#lib/components/CodeSample.svelte';
	import type { Component } from 'svelte';
	import type { PageProps } from './$types';

	// A site's own hero demo, if it has one (see src/custom/README.md).
	const CustomHero = Object.values(
		import.meta.glob<Component>('/src/custom/Hero.svelte', { eager: true, import: 'default' })
	)[0];

	// All the words live in site.config.ts. This file is layout only, so a
	// tool that needs a custom demo can swap the hero and keep the rest.
	let { data }: PageProps = $props();
	const hero = site.hero;
</script>

<svelte:head>
	<title>{site.name} · {site.description}</title>
	<meta name="description" content={site.description} />
	<link rel="alternate" type="text/markdown" href={href('/index.md')} title="Markdown" />
</svelte:head>

<SiteHeader />

<main>
	<section class="hero">
		<div class="pitch">
			{#if site.status}
				<p class="chip reveal" style:--i="0"><span class="pulse" aria-hidden="true"></span>{site.status}</p>
			{/if}
			<h1 class="reveal" style:--i="1">{hero.title}</h1>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p class="lead reveal" style:--i="2">{@html data.lead}</p>
			<div class="cta reveal" style:--i="3">
				<CopyLine command={site.install} />
				<p class="req">{site.requirement}</p>
			</div>
			{#if hero.link}
				<p class="reveal" style:--i="4"><a class="more" href={href(hero.link.href)}>{hero.link.label}</a></p>
			{/if}
		</div>
		{#if CustomHero || hero.image || hero.code}
			<div class="demo reveal" style:--i="2">
				{#if CustomHero}
					<CustomHero />
				{:else if hero.image}
					<img class="shot" src={href(hero.image.src)} alt={hero.image.alt} />
				{:else if hero.code}
					<CodeSample code={hero.code} terminal />
				{/if}
			</div>
		{/if}
	</section>

	{#each data.sections as s (s.title)}
		<section class={['band', { solo: !s.items && !s.code && !s.image }]}>
			<div class="copy">
				<p class="eyebrow">{s.eyebrow}</p>
				<h2>{s.title}</h2>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<p>{@html s.body}</p>
				{#if s.link}<a class="more" href={href(s.link.href)}>{s.link.label}</a>{/if}
			</div>
			{#if s.items}
				<ul class="items edge">
					{#each s.items as it (it.name)}
						<li><span class="name">{it.name}</span><span class="text">{it.text}</span></li>
					{/each}
				</ul>
			{:else if s.code}
				<CodeSample code={s.code} />
			{:else if s.image}
				<img class="shot" src={href(s.image.src)} alt={s.image.alt} />
			{/if}
		</section>
	{/each}

	{#if data.questions.length}
		<section class="faq">
			<p class="eyebrow">Questions</p>
			<dl>
				{#each data.questions as q (q.q)}
					<div>
						<dt>{q.q}</dt>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<dd>{@html q.a}</dd>
					</div>
				{/each}
			</dl>
		</section>
	{/if}
</main>

<SiteFooter />

<style>
	main {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 var(--gutter);
	}

	/* ---------- hero ---------- */

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 3rem;
		align-items: center;
		min-height: min(46rem, calc(100dvh - 5rem));
		padding: 3.5rem 0 4rem;
	}

	@media (min-width: 64rem) {
		.hero {
			grid-template-columns: minmax(0, 1fr) minmax(0, 30rem);
			gap: 4rem;
		}
	}

	.pitch {
		min-width: 0;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 1.5rem;
		justify-items: start;
		max-width: 36rem;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.7rem 0.25rem 0.6rem;
		border-radius: 999px;
		background: var(--wash);
		color: var(--soft);
		font-size: var(--text-small);
	}

	.pulse {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
	}

	h1 {
		font-size: var(--text-display);
		line-height: 1.06;
		letter-spacing: -0.03em;
	}

	.lead {
		color: var(--soft);
		font-size: var(--text-lead);
		line-height: 1.5;
		max-width: 33rem;
	}

	.cta {
		display: grid;
		gap: 0.6rem;
		width: 100%;
		max-width: 34rem;
		margin-top: 0.5rem;
	}

	.req {
		color: var(--muted);
		font-size: var(--text-small);
		padding-left: 1rem;
	}

	.more {
		color: var(--ink);
		font-size: var(--text-nav);
		text-decoration: underline;
		text-decoration-color: var(--faint);
		text-underline-offset: 3px;
		transition: text-decoration-color var(--dur-hover);
	}

	.more::after {
		content: ' →';
		color: var(--muted);
	}

	.more:hover {
		text-decoration-color: currentColor;
	}

	.demo {
		display: grid;
		min-width: 0;
	}

	/* a once-only stagger for the hero, nothing elsewhere moves on load */
	@media (prefers-reduced-motion: no-preference) {
		.reveal {
			animation: reveal 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
			animation-delay: calc(var(--i) * 60ms);
		}
	}

	@keyframes reveal {
		from {
			opacity: 0;
			translate: 0 10px;
			filter: blur(3px);
		}
	}

	/* ---------- bands ---------- */

	.band {
		display: grid;
		gap: 2rem;
		padding: 4.5rem 0;
	}

	@media (min-width: 60rem) {
		.band {
			grid-template-columns: 22rem minmax(0, 1fr);
			gap: 4rem;
			align-items: start;
		}
	}

	.copy {
		display: grid;
		gap: 0.75rem;
		justify-items: start;
	}

	h2 {
		font-size: clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem);
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.copy p:not(.eyebrow) {
		color: var(--soft);
		line-height: 1.55;
	}

	.copy :global(a:not(.more)) {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--faint);
		text-underline-offset: 3px;
	}

	.copy :global(code),
	.faq :global(code) {
		background: var(--wash);
		padding: 0.1em 0.35em;
		border-radius: var(--radius-sm);
		color: var(--ink);
	}

	/* native-feeling list: no lines, a wash on hover */
	.items {
		list-style: none;
		padding: 0.4rem;
		border-radius: var(--radius-panel);
		box-shadow: var(--shadow-surface);
	}

	.items li {
		display: grid;
		grid-template-columns: 7rem 1fr;
		align-items: baseline;
		gap: 0.75rem;
		padding: 0.7rem 0.75rem;
		border-radius: var(--radius-item);
		transition: background-color var(--dur-hover);
	}

	.items li:hover {
		background: var(--wash);
	}

	.items .name {
		color: var(--ink);
		font-family: var(--font-mono);
		font-size: var(--text-small);
	}

	.items .text {
		color: var(--soft);
	}

	@media (max-width: 30rem) {
		.items li {
			grid-template-columns: 1fr;
			gap: 0.15rem;
		}
	}

	.band.solo .copy {
		max-width: 36rem;
	}

	@media (min-width: 60rem) {
		.band.solo {
			grid-template-columns: 22rem minmax(0, 36rem);
		}
		.band.solo .copy {
			grid-column: 1 / -1;
		}
	}

	.shot {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--radius-frame);
		box-shadow: var(--shadow-raised);
	}

	/* ---------- questions ---------- */

	.faq {
		padding: 4.5rem 0 5rem;
	}

	.faq dl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
		gap: 2rem 4rem;
		max-width: 52rem;
		margin-top: 1.25rem;
	}

	.faq dt {
		color: var(--ink);
		padding-bottom: 0.35rem;
	}

	.faq dd {
		color: var(--soft);
		line-height: 1.55;
	}

	.faq :global(a) {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--faint);
		text-underline-offset: 3px;
	}
</style>
