---
title: Overview
description: Small Go packages for the things every terminal tool needs.
group: craftkit
---

**craftkit is four small Go packages: follow the terminal's colours, share one exit code table, ship an agent skill inside the binary, and report status to the terminal.**

Every CLI and pane ends up solving the same small problems, and each copy drifts a little. craftkit keeps one copy. Each package was pulled out of [radar](/docs/installation) when it needed one, and the API will change while there's only one user.

```sh
go get github.com/rynf1t/craftkit
```

| Package | Does |
|---|---|
| [`termcolor`](/docs/termcolor) | Asks the terminal for its foreground, background and palette colours (OSC 10, 11, 4), retrying while a new pane attaches. Mixes greys from them. |
| [`cliout`](/docs/cliout) | The exit code table, errors that carry a code, and JSON that's indented on a terminal and compact when piped. |
| [`skillkit`](/docs/skillkit) | Installs an embedded `SKILL.md` and reports `created`, `unchanged`, `outdated` or `foreign`. Never touches a file it didn't write. |
| [`status`](/docs/status) | Writes OSC 7501 program status reports: idle, working, blocked, done, error. |

## Rules the packages keep

- No package reads the terminal itself. Callers own stdin and pass replies in.
- A package is added only when a tool needs it, and moves here from that tool.
- One folder per package, each with a test file. Run `go test ./...`.
