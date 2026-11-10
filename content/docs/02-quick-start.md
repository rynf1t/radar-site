---
title: Quick start
description: Open the radar beside your pane and jump to the agent that needs you.
group: Get started
---

**Run `radar show` in any Rex terminal. The radar opens in a pane beside you without taking focus.**

```sh
radar show
```

Run it again and it prints the same pane ID instead of opening another. Each agent pane gets its own radar, keyed on `REX_BLOCK`. To share one radar between several panes, set the same `RADAR_PANE` in each.

## Keys

| Key | Does |
|---|---|
| `↑` `↓` or `j` `k` | Move |
| `enter` | Jump to that agent's pane |
| `/` | Filter by session, title, message, state or folder. `esc` clears it. |
| `g` `G` | First, last |
| `q` | Quit |

Clicking a row jumps there too.

## Jumping

Enter focuses the agent's pane in its session, then asks the Rex app to show that session. The second step needs **Remote Control**, which you turn on in Rex Settings under Rex Server. Without it the pane tells you so instead of failing quietly.

## One key from any session

A radar pane belongs to the session that opened it. To bring the radar up from anywhere, add the Rex plugin. It's `rex/radar.lua` in the radar repository. From a clone of it:

```sh
ln -s "$PWD/rex/radar.lua" ~/.config/rex/radar.lua
```

Then load it from `~/.config/rex/init.lua`:

```lua
local radar = dofile(os.getenv("HOME") .. "/.config/rex/radar.lua")
radar.setup{ key = "cmd+shift+u" }
```

Run `rex config reload`. Cmd+Shift+U now floats the radar over whatever you're looking at. Enter jumps to an agent and closes the float. Esc or Cmd+Shift+U closes it and puts focus back where it was.

`setup` also takes `binary`, the radar to run, which is `~/go/bin/radar` by default. Pass `key = false` to keep the action in the command palette without a key.

## Close it

```sh
radar hide
```

## Toasts from other sessions

Rex sends a macOS notification when an agent needs you, but only while Rex is in the background. While you work in one session, an agent in another can wait unseen. `radar watch` covers that:

```sh
radar watch
```

When an agent in a session you aren't looking at becomes blocked, fails or finishes, a small card appears in the top right of the tab you're on. Click it to jump there. Add `--states blocked,error` to skip finished agents.

To run it at login instead of in a pane:

```sh
radar watch --plist > ~/Library/LaunchAgents/io.github.rynf1t.radar.watch.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/io.github.rynf1t.radar.watch.plist
```

It waits for Rex and never starts it. It logs to `~/Library/Logs/radar-watch.log`, and only one runs at a time.
