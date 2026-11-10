// The favicon is the wordmark's mark, in the site's own colours.
import { defaultMark, oklchHex } from '#lib/config.js';
import { site } from '#lib/site.js';

export function GET() {
	const { tint, accent } = site.colours;
	const ink = oklchHex(0.2, 0.014, tint);
	const inkDark = oklchHex(0.93, 0.006, tint);
	const acc = oklchHex(0.72, 0.15, accent);
	const mark = (site.mark ?? defaultMark).replaceAll('var(--accent)', acc);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><style>svg{color:${ink}}@media (prefers-color-scheme:dark){svg{color:${inkDark}}}</style>${mark}</svg>`;
	return new Response(svg, { headers: { 'content-type': 'image/svg+xml' } });
}

export const prerender = true;
