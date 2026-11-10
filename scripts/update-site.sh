#!/usr/bin/env bash
# Bring this site up to the latest toolsite template.
#
#   scripts/update-site.sh [--template DIR]
#
# Replaces the template's code (src, scripts, AGENTS.md, build config) and
# merges package.json. Leaves your words and files alone: site.config.ts,
# content, static, src/custom and README.md. Doesn't commit, so you can look
# at the diff first.
#
# The template comes from --template, then $TOOLSITE_TEMPLATE, then
# ~/Projects/toolsite, then a fresh clone of github.com/rynf1t/toolsite.
set -euo pipefail
cd "$(dirname "$0")/.."

template=${TOOLSITE_TEMPLATE:-}
while (($#)); do
	case $1 in
		--template) template=${2:?--template needs a folder}; shift 2 ;;
		-h|--help) sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
		*) echo "update-site: unknown argument $1" >&2; exit 2 ;;
	esac
done

if [[ ! -f site.config.ts ]]; then
	echo "update-site: run this from a toolsite site, not the template" >&2
	exit 1
fi
if [[ -n $(git status --porcelain) ]]; then
	echo "update-site: commit or stash your changes first, so the update is its own diff" >&2
	exit 1
fi

if [[ -z $template && -d $HOME/Projects/toolsite/.git ]]; then
	template=$HOME/Projects/toolsite
fi
if [[ -z $template ]]; then
	template=$(mktemp -d)
	trap 'rm -rf "$template"' EXIT
	git clone -q --depth 1 https://github.com/rynf1t/toolsite "$template"
fi
if [[ $(cd "$template" && pwd) == $(pwd) ]]; then
	echo "update-site: that's the template itself" >&2
	exit 1
fi

# What the template owns. Everything else belongs to the site.
rsync -a --delete --exclude custom/ "$template/src/" src/
for f in AGENTS.md CLAUDE.md vite.config.ts tsconfig.json .npmrc .gitignore \
	scripts/deploy-pages.sh scripts/update-site.sh scripts/cloudflare-token.sh scripts/cloudflare-dns.mjs; do
	if [[ -f $template/$f ]]; then
		mkdir -p "$(dirname "$f")"
		cp "$template/$f" "$f"
	fi
done
mkdir -p src/custom
[[ -f src/custom/README.md ]] || cp "$template/src/custom/README.md" src/custom/README.md

# package.json: the template's scripts and dependencies, the site's name.
node -e '
const fs = require("fs");
const site = JSON.parse(fs.readFileSync("package.json", "utf8"));
const tpl = JSON.parse(fs.readFileSync(process.argv[1] + "/package.json", "utf8"));
const out = { ...tpl, name: site.name };
fs.writeFileSync("package.json", JSON.stringify(out, null, "\t") + "\n");
' "$template"

version=$(git -C "$template" rev-parse --short HEAD 2>/dev/null || echo unknown)
echo "$version" >.toolsite-version

if ! git diff --quiet package.json; then
	npm install --silent
fi

echo "Updated to toolsite $version. Changed:"
git status --short
echo
echo "Check it with npm run check, npm run build and npm run dev, then commit."
