#!/usr/bin/env bash
# Save a Cloudflare API token so deploy-pages.sh can add DNS records itself.
# Run it once per Mac, in a terminal. The token goes in your login keychain
# under "toolsite-cloudflare", never in a file.
set -euo pipefail

cat <<MSG
1. Your browser is opening Cloudflare's "Create API token" page.
2. Use the "Edit zone DNS" template. Under Zone Resources pick
   "Specific zone" and your domain (or "All zones").
3. Create the token, copy it, and paste it here.

MSG
open 'https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22dns%22%2C%22type%22%3A%22edit%22%7D%5D&name=toolsite%20DNS' 2>/dev/null || true

read -rsp "Token: " token
echo
if [[ -z $token ]]; then
	echo "cloudflare-token: no token pasted, nothing saved" >&2
	exit 1
fi

status=$(curl -s -H "Authorization: Bearer $token" https://api.cloudflare.com/client/v4/user/tokens/verify |
	node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log(j.success?j.result.status:"invalid")}catch{console.log("invalid")}})')
if [[ $status != active ]]; then
	echo "cloudflare-token: Cloudflare says this token is $status. Nothing saved." >&2
	exit 1
fi

security add-generic-password -U -a toolsite -s toolsite-cloudflare -w "$token"
echo "Saved. deploy-pages.sh will now add DNS records for your own domains."
