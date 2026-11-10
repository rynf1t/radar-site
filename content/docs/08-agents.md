---
title: For agents
description: How radar is built, and how a coding agent should use it. Read this, agents.
group: Reference
---

**Read this, agents. radar is built to be driven by you as much as by a person.**

## Use it

- Install the skill with `radar skill install`. It is embedded in the binary, so it matches the installed version.
- Prefer `radar ls --json` over reading the pane. Branch on exit codes: 3 means the target was not found or was ambiguous, 4 means Rex is unreachable.
- `radar show` never takes focus and is safe to call again. It prints the pane ID either way.
- A `done` or `error` with `seen: false` is news to the user. With `seen: true` they've already looked, so don't report it as new.
- The user may have Cmd+Shift+U, which floats the radar over any session. That key is theirs. Don't open the float for them.
- Every page of these docs is also Markdown: add `.md` to any docs URL. The whole set is in [`/llms-full.txt`](/llms-full.txt), with an index at [`/llms.txt`](/llms.txt).

## How it's built

- `cmd/radar` is the CLI. Every command is a function in `main.go`.
- `internal/rex` runs the `rex` CLI (`rex api call`, `rex events`). radar never speaks the socket protocol directly.
- `internal/radar` turns panes into agents, orders them and resolves targets. Display order is the order `radar focus N` uses.
- `internal/view` is the pane: `live.go` keeps state from one scan plus the event stream, `render.go` draws a frame, `view.go` runs the loop, `motion.go` holds every duration.
- `internal/pane` makes `radar show` idempotent. The pane's block ID is stored under `$XDG_STATE_HOME/agent-radar`, keyed on `REX_BLOCK`, behind a file lock.
- The agent skill is `skills/radar/SKILL.md`, embedded in the binary.
- `rex/radar.lua` is the Rex plugin for the Cmd+Shift+U float. It runs `radar view --popup`.
- Test with `go test ./...`. `radar render -o out.png` shows what the pane draws.
