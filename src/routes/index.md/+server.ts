import { landingMarkdown } from '#lib/landing.server.js';

export function GET() {
	return new Response(landingMarkdown(), { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}

export const prerender = true;
