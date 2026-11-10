---
title: Configuration
description: The environment variables radar reads. There is no config file.
group: Using radar
---

**radar has no config file. The defaults come from Rex and your terminal, and four environment variables cover the rest.**

| Variable | Does |
|---|---|
| `RADAR_PANE` | Keys the pane `show` and `hide` manage. Defaults to `REX_BLOCK`, so each agent pane gets its own radar. Set the same value in several panes to share one. |
| `RADAR_MOTION=off` | Turns off motion. Reduce Motion in macOS does the same. |
| `RADAR_SCALE` | Device pixels per point, when the cell size guess is wrong. |
| `RADAR_FONT` | A `.ttf` or `.otf` to draw with instead of the system font. |

## Where state lives

The pane's block ID is stored under `$XDG_STATE_HOME/agent-radar`, keyed on `REX_BLOCK`, behind a file lock. That is what makes `radar show` idempotent when several agents call it at once.
