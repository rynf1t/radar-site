---
title: Float the radar over any session, and seen tracking
description: The Cmd+Shift+U popup, and finished agents that stay marked until you look.
version: 0.2.0
---

**Cmd+Shift+U now floats the radar over whatever session you're in, and finished agents stay marked until you've seen them.**

## The popup

`rex/radar.lua` is a Rex plugin that floats the radar over any session. `radar view --popup` closes on Esc or after a jump, and hands focus back to the pane it covered. See [One key from any session](/docs/quick-start#one-key-from-any-session).

## Seen

A done or error agent counts as seen once a Rex app has shown its pane since it finished. Seen agents sort and count as idle, with a grey dot. `radar ls --json` now includes `seen`.
