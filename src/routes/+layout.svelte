<script lang="ts">
	import '@fontsource-variable/instrument-sans';
	import '../app.css';
	import { focusHue, oklchHex } from '#lib/config.js';
	import { href, site } from '#lib/site.js';
	import Search from '#lib/components/Search.svelte';
	import type { LayoutProps } from './$types';

	// A site's own styles, after the template's (see src/custom/README.md).
	import.meta.glob('/src/custom/*.css', { eager: true });

	let { children }: LayoutProps = $props();

	// The site's identity: two hues from site.config.ts. app.css derives the rest.
	const { tint, accent } = site.colours;
	const hues = `<style>html:root{--tint-h:${tint};--accent-h:${accent};--focus-h:${focusHue(accent)}}</style>`;
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html hues}
	<link rel="icon" href={href('/favicon.svg')} type="image/svg+xml" />
	<meta name="theme-color" content={oklchHex(0.975, 0.004, tint)} media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content={oklchHex(0.175, 0.009, tint)} media="(prefers-color-scheme: dark)" />
</svelte:head>

{@render children()}
<Search />
