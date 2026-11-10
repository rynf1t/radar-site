---
title: States
description: The five states radar shows, what each mark means, and how the list is ordered.
group: Using radar
---

**radar groups agents by session and orders everything by urgency, then by how long each agent has waited.**

Rex already knows each agent's state, because agents report it with the [program status protocol](https://www.superlogical.com/rex/docs/build/program-status). radar puts all of it in one list, so the agent that has waited longest on you is at the top.

| State | Mark | Meaning |
|---|---|---|
| blocked | <span class="mark blocked"></span> yellow dot | Waiting on you: a permission, a question or a login |
| error | <span class="mark error"></span> red dot | Failed and stopped |
| done | <span class="mark done"></span> blue dot | Finished, and you haven't looked yet. Once you have, it drops to the bottom with a grey dot. |
| working | <span class="mark working"></span> ring | Busy. The ring fills if the agent reports progress. |
| idle | <span class="mark idle"></span> small grey dot | Waiting for its next instruction |

## Each row

A row shows the title, what the agent says it's doing or asking, the app, the folder, and how long ago the state changed.

## What counts as an agent

Any Rex pane whose program reports a status, or that runs a known agent: `claude`, `codex`, `aider`, `gemini`, `opencode` and a few more.

## Colour and motion

Colours come from your terminal theme. radar asks the terminal for its foreground, background, red, yellow and blue, then mixes its greys from them. It follows a theme switch within a second.

Nothing moves unless something changed. Rows glide to a new order in 150ms with an expo ease out. macOS Reduce Motion turns that off, and so does `RADAR_MOTION=off`.

## Seen

A finished or failed agent stays near the top until you look at it. radar counts it as seen once a Rex app has shown its pane since the agent finished. From then on it sorts with the idle agents and takes their grey dot, so the top of the list is only news.

An agent that finishes in a pane you're already looking at stays unseen until the app shows that pane again.
