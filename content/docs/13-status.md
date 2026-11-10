---
title: status
description: Report what your program is doing with OSC 7501.
group: craftkit
---

**status writes program status reports, so Rex and radar can show what your tool is doing without guessing.**

```go
status.Report{State: status.Blocked, App: "mytool", Kind: status.Permission,
	Msg: "Delete 3 files?"}.Write(os.Stdout)
status.Report{State: status.Working, App: "mytool", Progress: status.Percent(40)}.Write(os.Stdout)
```

The states are `idle`, `working`, `blocked`, `done` and `error`. They are the same states radar [shows](/docs/states).

## Rules

- Each report replaces its record completely, so send every field you want to keep.
- `msg` and `title` must be one line.
- Report `done` only for a result the user hasn't seen.

The protocol is specified in the [Rex docs](https://www.superlogical.com/rex/docs/build/program-status).
