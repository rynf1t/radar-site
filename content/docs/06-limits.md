---
title: Limits
description: What radar doesn't do yet, and why.
group: Reference
---

**radar is early and in daily use by one person. These are the edges you'll meet.**

- **Jumping needs Remote Control.** radar focuses the pane in its session, then asks the Rex app to show that session. The second step needs Remote Control on in Rex Settings, under Rex Server. Without it the pane says so.
- **Seen means a Rex app showed the pane after the agent finished.** An agent that finishes in a pane you're already looking at stays unseen until the app shows that pane again.
- **One machine.** radar reads the local Rex server. Agents on other hosts don't appear yet.
- **Toasts need to know which session you're on.** Rex doesn't publish that, so `radar watch` reads it from the Rex app's preferences. A Rex update could move it, and then the watcher logs why it skipped a toast.
- **Titles and folders refresh every 20 seconds.** Status changes arrive straight away from the event stream.
- **The CLI and JSON shape may still change** while the project is early.
