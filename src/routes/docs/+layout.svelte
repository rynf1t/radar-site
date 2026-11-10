<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import Wordmark from '#lib/components/Wordmark.svelte';
	import SearchTrigger from '#lib/components/SearchTrigger.svelte';
	import ModeToggle from '#lib/components/ModeToggle.svelte';
	import { copyButtons } from '#lib/copy.js';
	import { href } from '#lib/site.js';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	let menuOpen = $state(false);

	const current = $derived(page.url.pathname);

	afterNavigate(() => (menuOpen = false));
</script>

{#snippet navList()}
	{#each data.nav as group (group.label)}
		<div class="group">
			<p class="label">{group.label}</p>
			<ul>
				{#each group.items as item (item.path)}
					{@const here = current === href(item.path)}
					<li>
						<a class={['link', { here }]} href={href(item.path)} aria-current={here ? 'page' : undefined}>{item.title}</a>
						{#if here && item.headings.length}
							<ul class="toc">
								{#each item.headings as h (h.id)}
									<li><a class="link sub" href="#{h.id}">{h.text}</a></li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
{/snippet}

<div class="docs">
	<aside class="sidebar" aria-label="Docs">
		<div class="top">
			<div class="brand"><Wordmark /><ModeToggle /></div>
			<SearchTrigger wide />
		</div>
		<nav class="scroll">
			{@render navList()}
		</nav>
	</aside>

	<header class="mobile">
		<Wordmark />
		<ModeToggle />
		<button
			type="button"
			class="toggle"
			aria-expanded={menuOpen}
			aria-controls="docs-menu"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<svg viewBox="0 0 20 20" aria-hidden="true">
				<path class="a" d="M4 7.5h12" />
				<path class="b" d="M4 12.5h12" />
			</svg>
		</button>
	</header>

	<div id="docs-menu" class={['menu', { open: menuOpen }]} inert={!menuOpen}>
		<SearchTrigger wide />
		<nav class="menu-scroll" aria-label="Docs">
			{@render navList()}
		</nav>
	</div>

	<main class="main" {@attach copyButtons}>
		{@render children()}
	</main>
</div>

<style>
	.docs {
		--side: 12.5rem;
		--side-left: clamp(1rem, calc((100vw - 74rem) / 2), 4rem);
	}

	.sidebar {
		position: fixed;
		inset-block: 0;
		left: var(--side-left);
		width: var(--side);
		display: flex;
		flex-direction: column;
		padding-top: 2.5rem;
	}

	.top {
		display: grid;
		gap: 1.5rem;
		padding-bottom: 0.75rem;
	}

	.brand {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-right: -0.35rem;
	}

	.scroll {
		overflow-y: auto;
		scrollbar-width: none;
		padding: 0.75rem 0 3rem;
		/* fades appear only on a side that can scroll */
		--fade-top: 0px;
		--fade-bottom: 2.5rem;
		mask-image: linear-gradient(
			to bottom,
			transparent,
			black var(--fade-top),
			black calc(100% - var(--fade-bottom)),
			transparent
		);
	}

	@supports (animation-timeline: scroll()) {
		.scroll {
			animation:
				fade-top linear both,
				fade-bottom linear both;
			animation-timeline: scroll(self), scroll(self);
			animation-range:
				0 2.5rem,
				calc(100% - 2.5rem) 100%;
		}
	}

	@property --fade-top {
		syntax: '<length>';
		inherits: false;
		initial-value: 0px;
	}

	@property --fade-bottom {
		syntax: '<length>';
		inherits: false;
		initial-value: 2.5rem;
	}

	@keyframes fade-top {
		from {
			--fade-top: 0px;
		}
		to {
			--fade-top: 2.5rem;
		}
	}

	@keyframes fade-bottom {
		from {
			--fade-bottom: 2.5rem;
		}
		to {
			--fade-bottom: 0px;
		}
	}

	/* never fade the item that has keyboard focus */
	.scroll:has(:focus-visible),
	.menu-scroll:has(:focus-visible) {
		mask-image: none;
	}

	.group + .group {
		margin-top: 1.5rem;
	}

	.label {
		color: var(--muted);
		font-size: var(--text-nav);
		padding-bottom: 0.4rem;
	}

	ul {
		list-style: none;
	}

	.link {
		display: block;
		padding: 0.2rem 0.375rem;
		margin-inline-start: -0.375rem;
		border-radius: var(--radius-item);
		color: var(--soft);
		font-size: var(--text-nav);
		letter-spacing: -0.01em;
		line-height: 1.3;
		text-decoration: none;
		transition:
			color var(--dur-hover),
			background-color var(--dur-hover);
	}

	.link:hover,
	.link.here {
		color: var(--ink);
	}

	.link:focus-visible {
		outline-offset: -2px;
		background: var(--focus-wash);
		color: var(--ink);
	}

	.toc {
		margin: 0.15rem 0 0.35rem 0.1rem;
		padding-left: 0.75rem;
		border-left: 1px solid var(--rule);
	}

	.sub {
		font-size: 0.8125rem;
		color: var(--muted);
	}

	.main {
		padding: 2.5rem var(--gutter) 6rem;
		padding-left: calc(var(--side-left) + var(--side) + clamp(2.5rem, 6vw, 7rem));
	}

	/* ---------- phones and narrow windows ---------- */

	.mobile,
	.menu {
		display: none;
	}

	@media (max-width: 52rem) {
		.sidebar {
			display: none;
		}

		.main {
			padding: 1.5rem 1.25rem 5rem;
		}

		.mobile {
			position: sticky;
			top: 0;
			z-index: 50;
			display: flex;
			align-items: center;
			gap: 0.25rem;
			height: 3.5rem;
			padding: 0 1.25rem;
			background: color-mix(in oklab, var(--paper) 88%, transparent);
			backdrop-filter: blur(12px);
		}

		.mobile :global(.wordmark) {
			margin-right: auto;
		}

		.toggle {
			width: 2.25rem;
			height: 2.25rem;
			display: grid;
			place-items: center;
			margin-right: -0.5rem;
			border-radius: var(--radius-item);
		}

		.toggle svg {
			width: 20px;
			height: 20px;
			stroke: currentColor;
			stroke-width: 1.5;
			stroke-linecap: round;
		}

		.toggle path {
			transform-origin: 10px 10px;
			transition: transform 320ms var(--ease-sheet);
		}

		.toggle[aria-expanded='true'] .a {
			transform: translateY(2.5px) rotate(45deg);
		}

		.toggle[aria-expanded='true'] .b {
			transform: translateY(-2.5px) rotate(-45deg);
		}

		.menu {
			position: fixed;
			inset: 3.5rem 0 0;
			z-index: 40;
			display: grid;
			grid-template-rows: auto 1fr;
			gap: 1.25rem;
			padding: 0.5rem 1.25rem 0;
			background: var(--paper);
			transform: translateX(100%);
			visibility: hidden;
			transition:
				transform 320ms var(--ease-sheet),
				visibility 0s linear 320ms;
		}

		.menu.open {
			transform: none;
			visibility: visible;
			transition: transform 320ms var(--ease-sheet);
		}

		:global(html:has(.menu.open)) {
			overflow: hidden;
		}

		.menu-scroll {
			overflow-y: auto;
			overscroll-behavior: contain;
			padding-bottom: 3rem;
		}

		.menu .link {
			font-size: 1.1875rem;
			padding-block: 0.3rem;
		}

		.menu .sub {
			font-size: 1rem;
		}

		.menu .label {
			font-size: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu,
		.menu.open,
		.toggle path {
			transition: none;
		}
	}
</style>
