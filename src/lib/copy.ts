import type { Attachment } from 'svelte/attachments';

// Wires every `button.copy` that the Markdown renderer puts beside a code block.
export const copyButtons: Attachment<HTMLElement> = (node) => {
	async function onclick(e: MouseEvent) {
		const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button.copy');
		if (!btn) return;
		const code = btn.parentElement?.querySelector('pre')?.innerText ?? '';
		await navigator.clipboard.writeText(code.replace(/\n$/, ''));
		btn.dataset.copied = '';
		btn.setAttribute('aria-label', 'Copied');
		setTimeout(() => {
			delete btn.dataset.copied;
			btn.setAttribute('aria-label', 'Copy code');
		}, 1400);
	}
	node.addEventListener('click', onclick);
	return () => node.removeEventListener('click', onclick);
};
