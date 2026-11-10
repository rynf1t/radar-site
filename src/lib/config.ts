// The shape of site.config.ts. Read AGENTS.md before changing it.

export type Link = { label: string; href: string };

export type Section = {
	/** One or two words, shown muted above the title. */
	eyebrow: string;
	/** A short headline. */
	title: string;
	/** Two or three sentences of inline Markdown. */
	body: string;
	link?: Link;
	/** A list of name and text rows beside the copy. */
	items?: { name: string; text: string }[];
	/** A code sample beside the copy. Lines starting with # are comments. */
	code?: string;
	/** A screenshot in static/, beside the copy. */
	image?: { src: string; alt: string };
};

export type SiteConfig = {
	name: string;
	/** One sentence a stranger understands. Used for meta tags and llms.txt. */
	description: string;
	repo: string;
	/** The public address. VITE_ORIGIN overrides it at build time. */
	origin: string;
	/** The first command. Shown with a copy button. */
	install: string;
	/** Printed under the install line. */
	requirement: string;
	/** A short chip above the headline, such as "Early" or "v1.2". */
	status?: string;
	colours: { tint: number; accent: number };
	/** Inside of a 20 by 20 SVG. */
	mark?: string;
	hero: {
		title: string;
		lead: string;
		code?: string;
		image?: { src: string; alt: string };
		link?: Link;
	};
	sections: Section[];
	questions: { q: string; a: string }[];
	/** Extra header links, after Docs. */
	nav?: Link[];
	/** Who made it, linked from the footer, such as { label: 'by Ryan', href: 'https://itsryan.me' }. */
	author?: Link;
};

/** The mark when site.config.ts has none: a dot in the accent. */
export const defaultMark = '<circle cx="10" cy="10" r="4" fill="var(--accent)"/>';

/** The focus ring gets its own hue, away from the accent. */
export function focusHue(accent: number) {
	const d = Math.abs(((accent - 262 + 540) % 360) - 180);
	return d < 50 ? 300 : 262;
}

/** oklch to a #rrggbb string, for places CSS variables can't reach (favicon, theme-color). */
export function oklchHex(l: number, c: number, h: number) {
	const hr = (h * Math.PI) / 180;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);
	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const lin = [
		4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
		-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
		-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
	];
	return (
		'#' +
		lin
			.map((x) => {
				const v = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
				return Math.round(Math.min(1, Math.max(0, v)) * 255)
					.toString(16)
					.padStart(2, '0');
			})
			.join('')
	);
}
