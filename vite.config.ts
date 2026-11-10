import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// VITE_BASE puts the site under a subfolder. See src/lib/site.ts.
	const base = loadEnv(mode, '.', 'VITE_').VITE_BASE as '' | `/${string}` | undefined;
	return {
		plugins: [
			sveltekit({
				compilerOptions: {
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},
				// Every page, Markdown twin and index is prerendered to static files.
				adapter: adapter({ fallback: '404.html' }),
				// Absolute links, so href() and SvelteKit agree.
				paths: { base: base ?? '', relative: false },
				prerender: { handleMissingId: 'warn' }
			})
		]
	};
});
