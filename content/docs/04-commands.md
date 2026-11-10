---
title: Commands
description: Every radar command, its flags and its exit codes.
group: Using radar
---

**Every command is one verb. Commands that change something are safe to run twice.**

```
radar show [--split right|below] [--ratio PCT] [--theme auto|light|dark]
radar hide
radar ls [--json] [--state STATE]
radar focus [TARGET]
radar view [--popup [--back BLOCK]]
radar watch [--states blocked,error,done] [--plist]
radar render -o FILE.png [--width PX] [--height PX] [--theme light|dark]
radar demo STATE [--kind KIND] [--msg TEXT] | radar demo cycle
radar skill install|show|remove [--dir DIR] [--dry-run] [--force]
radar version
```

## show

Opens the radar in a pane beside yours without taking focus. Idempotent: if this pane's radar is already open, it prints that pane's ID. `--split below` stacks it underneath, `--ratio` sets its share of the space, and `--theme` overrides the terminal's colours.

## hide

Closes the radar pane that `show` opened for this pane.

## ls

Prints every agent in display order. `--json` prints the same list for scripts, indented on a terminal and compact when piped. `--state blocked` keeps one state. Each agent in the JSON has `block_id`, `session`, `state`, `kind`, `title`, `msg`, `app`, `cwd`, `since` and `seen`.

## focus

Jumps to an agent. `TARGET` is a position from `radar ls` (1 is the most urgent), a session label or a block ID suffix. Without a target it goes to the most urgent agent. An ambiguous target changes nothing, lists what it matched, and exits 3.

## view

Runs the radar in the current terminal instead of a new pane. This is what `show` runs.

`--popup` closes it on Esc and after a jump, then focuses `BLOCK` again unless the jump stayed in this session. The [Cmd+Shift+U float](/docs/quick-start#one-key-from-any-session) runs this.

## watch

Shows a toast in the tab you're looking at when an agent in another session becomes blocked, fails or finishes. The toast doesn't take focus. Click it to jump to the agent. It closes after 30 seconds, or as soon as the agent moves on or you look at it.

`--states blocked,error` leaves out done. `--plist` prints a LaunchAgent that runs the watcher at login. See [Toasts from other sessions](/docs/quick-start#toasts-from-other-sessions).

## render

Writes one frame to a PNG. Use it to see what the pane draws, in a test or a bug report.

## demo

Reports a state from the current pane so you can see it without waiting for an agent to reach it. `radar demo cycle` steps through every state.

## skill

Installs, prints or removes the agent skill embedded in the binary. See [For agents](/docs/agents).

## Exit codes

| Code | Meaning |
|---|---|
| `0` | OK |
| `1` | The command ran and failed |
| `2` | Bad command line |
| `3` | Target not found or ambiguous |
| `4` | Rex unreachable |
| `130` | Interrupted |
