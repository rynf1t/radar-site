// Point HOST at TARGET with a DNS-only CNAME in Cloudflare, so GitHub Pages
// can serve it and issue the certificate.
//
//   CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-dns.mjs radar.itsryan.me rynf1t.github.io
//
// Exits 0 when the record is in place, 3 when an existing record points
// somewhere else (it never overwrites one), 1 on any other failure.
const [host, target] = process.argv.slice(2);
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!host || !target || !token) {
	console.error('usage: CLOUDFLARE_API_TOKEN=... node scripts/cloudflare-dns.mjs HOST TARGET');
	process.exit(2);
}

async function cf(path, init = {}) {
	const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
		...init,
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
	});
	const body = await res.json();
	if (!body.success) {
		const why = body.errors?.map((e) => e.message).join(', ') || res.statusText;
		throw new Error(`Cloudflare ${init.method ?? 'GET'} ${path}: ${why}`);
	}
	return body.result;
}

try {
	// The zone is the longest suffix of HOST that Cloudflare knows.
	const labels = host.split('.');
	let zone;
	for (let i = 1; i < labels.length - 1 && !zone; i++) {
		[zone] = await cf(`/zones?name=${labels.slice(i).join('.')}`);
	}
	if (!zone) throw new Error(`no Cloudflare zone this token can edit covers ${host}`);

	const records = await cf(`/zones/${zone.id}/dns_records?name=${host}`);
	const same = records.find((r) => r.type === 'CNAME' && r.content === target);
	if (same && !same.proxied) {
		console.log(`DNS: ${host} already points at ${target}`);
	} else if (same) {
		await cf(`/zones/${zone.id}/dns_records/${same.id}`, { method: 'PATCH', body: JSON.stringify({ proxied: false }) });
		console.log(`DNS: ${host} now skips Cloudflare's proxy, so GitHub can issue its certificate`);
	} else if (records.length) {
		console.error(`DNS: ${host} already has ${records.map((r) => `${r.type} ${r.content}`).join(', ')}.`);
		console.error(`Delete it in Cloudflare if this site should replace it, then deploy again.`);
		process.exit(3);
	} else {
		await cf(`/zones/${zone.id}/dns_records`, {
			method: 'POST',
			body: JSON.stringify({ type: 'CNAME', name: host, content: target, proxied: false, ttl: 1, comment: 'toolsite: GitHub Pages' })
		});
		console.log(`DNS: added ${host} → ${target}`);
	}
} catch (e) {
	console.error(`DNS: ${e.message}`);
	process.exit(1);
}
