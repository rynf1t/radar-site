import { nav } from '#lib/docs.server.js';

export function load() {
	return { nav: nav() };
}
