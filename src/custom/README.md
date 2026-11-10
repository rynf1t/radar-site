# Site-owned code

Everything in this folder belongs to this site. Template updates
(`scripts/update-site.sh`) never touch it.

- `Hero.svelte`: replaces the hero sample on the landing page, for a live
  demo. It renders in the right-hand column, about 30rem wide.
- `*.css`: loaded on every page after the template's styles. Use the tokens
  in `src/app.css` (`--ink`, `--accent`, `--surface` and the rest) so light
  and dark both work.
- Anything else a custom component imports.
