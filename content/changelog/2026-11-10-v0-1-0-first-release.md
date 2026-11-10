---
title: radar, every coding agent in one pane
description: The first release.
version: 0.1.0
---

**radar lists the agents across your Rex sessions, grouped by session and ordered by what needs you first.**

## What's in it

- `radar show` opens the radar beside your pane without taking focus. Run it again and it reuses the same pane.
- Agents sort blocked, error, done and unseen, working, then idle. Within each, the one that's waited longest comes first.
- Enter jumps to an agent's pane.
- `radar ls --json` gives scripts the same list.
- The agent skill ships inside the binary. `radar skill install` teaches Claude Code to use it.

Built on [craftkit](/docs/craftkit) v0.1.0, so `go install ...@latest` works.
