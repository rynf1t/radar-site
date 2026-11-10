#!/usr/bin/env bash
# Publish the site to GitHub Pages, at the address in site.config.ts (origin).
#
# The first run creates a public repo named after this folder and turns on
# Pages. Every run pushes main, builds for origin and replaces the gh-pages
# branch with the build. An origin outside github.io is treated as your own
# domain: no base path, a CNAME file, and a DNS record in Cloudflare if
# scripts/cloudflare-token.sh has saved a token.
set -euo pipefail
cd "$(dirname "$0")/.."

if grep -n 'TODO: ' site.config.ts content/docs/*.md >&2; then
	echo "deploy: fill in the TODOs above first" >&2
	exit 1
fi
if [[ -n $(git status --porcelain) ]]; then
	echo "deploy: commit your changes first, so the site matches main" >&2
	git status --short >&2
	exit 1
fi

origin=$(node -e "import('./site.config.ts').then(m => console.log(m.default.origin.replace(/\/$/, '')))")
host=$(sed -E 's#^https?://##; s#/.*##' <<<"$origin")
path=$(sed -E 's#^https?://[^/]+##' <<<"$origin")

if remote=$(git remote get-url origin 2>/dev/null); then
	repo=$(sed -E 's#^(git@github.com:|https://github.com/)##; s#\.git$##' <<<"$remote")
else
	repo="$(gh api user -q .login)/$(basename "$PWD")"
fi

if ! gh repo view "$repo" >/dev/null 2>&1; then
	gh repo create "$repo" --public --description "Site and docs, made with toolsite"
fi
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$repo.git"
git push -u origin main

VITE_BASE="$path" VITE_ORIGIN="$origin" npm run build
touch build/.nojekyll
custom=0
if [[ $host != *.github.io ]]; then
	custom=1
	echo "$host" >build/CNAME
fi

# Push the build as a fresh gh-pages branch, separate from main's history.
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
cp -R build/. "$out"
git -C "$out" init -q -b gh-pages
git -C "$out" add -A
git -C "$out" commit -q -m "Build of $(git rev-parse --short HEAD)"
git -C "$out" push -q -f "https://github.com/$repo.git" gh-pages

if ! gh api "repos/$repo/pages" >/dev/null 2>&1; then
	gh api -X POST "repos/$repo/pages" -f "source[branch]=gh-pages" -f "source[path]=/" >/dev/null
fi
if ((custom)); then
	gh api -X PUT "repos/$repo/pages" -f "cname=$host" >/dev/null
	token=${CLOUDFLARE_API_TOKEN:-$(security find-generic-password -s toolsite-cloudflare -w 2>/dev/null || true)}
	if [[ -n $token ]]; then
		CLOUDFLARE_API_TOKEN=$token node scripts/cloudflare-dns.mjs "$host" "${repo%%/*}.github.io"
	else
		echo "DNS: no Cloudflare token saved. Run scripts/cloudflare-token.sh once, or add a"
		echo "     DNS-only CNAME from $host to ${repo%%/*}.github.io yourself."
	fi
	# GitHub issues the certificate a few minutes after DNS resolves. Until then this fails quietly.
	gh api -X PUT "repos/$repo/pages" -F https_enforced=true >/dev/null 2>&1 || echo "HTTPS: GitHub is still issuing the certificate. Deploy again later to turn on HTTPS only."
fi

echo "Published. GitHub usually has it live within a minute, at $origin"
