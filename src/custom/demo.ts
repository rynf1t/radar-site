// Fictional agents for the landing page demo. The ordering rules match
// radar's: urgency first (blocked, error, done, working, idle), then how
// long each agent has waited. Sessions follow their most urgent agent.

export type State = 'blocked' | 'error' | 'done' | 'working' | 'idle';

export type Agent = {
	id: string;
	session: string;
	title: string;
	app: string;
	folder: string;
	state: State;
	msg: string;
	kind?: 'permission' | 'question' | 'login'; // blocked only
	progress?: number; // 0 to 1, working only
	since: number; // simulated minute the state last changed
};

export const rank: Record<State, number> = { blocked: 0, error: 1, done: 2, working: 3, idle: 4 };

// The same words radar uses (internal/radar/format.go).
export function label(a: Pick<Agent, 'state' | 'kind'>): string {
	if (a.state === 'blocked') {
		if (a.kind === 'permission') return 'Needs permission';
		if (a.kind === 'question') return 'Has a question';
		if (a.kind === 'login') return 'Needs a login';
		return 'Waiting on you';
	}
	return { error: 'Failed', done: 'Done', working: 'Working', idle: 'Idle' }[a.state];
}

export const initial: Agent[] = [
	{ id: 'a', session: 'billing-api', title: 'Migrate invoices to the v2 schema', app: 'Claude Code', folder: '~/work/billing-api', state: 'working', msg: 'Rewriting 14 queries', progress: 0.4, since: -6 },
	{ id: 'b', session: 'billing-api', title: 'Review the refunds PR', app: 'Codex', folder: '~/work/billing-api', state: 'idle', msg: '', since: -31 },
	{ id: 'c', session: 'ios-onboarding', title: 'Polish the welcome flow', app: 'Claude Code', folder: '~/work/ios-app', state: 'blocked', kind: 'question', msg: 'Use the new illustration set?', since: -4 },
	{ id: 'd', session: 'docs', title: 'Rewrite the install guide', app: 'Codex', folder: '~/work/docs', state: 'done', msg: 'Ready for review, 3 files changed', since: -12 },
	{ id: 'e', session: 'infra', title: 'Rotate staging certificates', app: 'Claude Code', folder: '~/work/infra', state: 'idle', msg: '', since: -48 }
];

type Change = { id: string; mins: number } & Partial<Omit<Agent, 'id' | 'session'>>;

// One change every few seconds. After the last one the demo starts over.
export const script: Change[] = [
	{ id: 'a', mins: 1, progress: 0.7, msg: 'Rewriting 14 queries' },
	{ id: 'e', mins: 1, state: 'working', msg: 'Checking certificate expiry', progress: undefined },
	{ id: 'a', mins: 2, state: 'blocked', kind: 'permission', msg: 'Run migrations on staging?', progress: undefined },
	{ id: 'c', mins: 1, state: 'working', msg: 'Swapping in the new illustrations', progress: 0.2 },
	{ id: 'd', mins: 1, state: 'idle', msg: '' },
	{ id: 'e', mins: 2, state: 'error', msg: 'certbot exited with status 1' },
	{ id: 'a', mins: 1, state: 'working', msg: 'Migrating staging', progress: 0.5 },
	{ id: 'c', mins: 2, state: 'done', msg: 'Welcome flow updated, 4 files changed', progress: undefined },
	{ id: 'e', mins: 1, state: 'working', msg: 'Retrying with a DNS challenge', progress: undefined },
	{ id: 'b', mins: 1, state: 'working', msg: 'Reading the refunds diff', progress: 0.3 }
];

export function order(agents: Agent[]): Agent[] {
	const byAgent = (x: Agent, y: Agent) => rank[x.state] - rank[y.state] || x.since - y.since;
	const best = new Map<string, Agent>();
	for (const a of agents) {
		const b = best.get(a.session);
		if (!b || byAgent(a, b) < 0) best.set(a.session, a);
	}
	const bySessionName = (x: Agent, y: Agent) => {
		if (x.session < y.session) return -1;
		if (x.session > y.session) return 1;
		return 0;
	};
	return [...agents].sort(
		(x, y) => byAgent(best.get(x.session)!, best.get(y.session)!) || bySessionName(x, y) || byAgent(x, y)
	);
}

export function ago(now: number, since: number) {
	const m = Math.round(now - since);
	if (m < 1) return 'now';
	if (m < 60) return `${m}m`;
	return `${Math.floor(m / 60)}h`;
}
