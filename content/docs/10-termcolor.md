---
title: termcolor
description: Ask the terminal for its colours instead of shipping a palette.
group: craftkit
---

**termcolor asks the terminal for its colours and mixes greys from them, so your tool matches whatever theme the user runs.**

```go
var th termcolor.Theme
// replies carries OSC reply bodies your input loop decodes, such as "11;rgb:1e1e/1f1f/2222".
err := termcolor.Wait(ctx, os.Stdout, replies, &th, nil, termcolor.Blue)
muted := termcolor.Mix(th.FG, th.BG, 0.5)
```

`Wait` sends OSC 10 and 11 for the foreground and background, and OSC 4 for each palette index you name. It asks every 250ms for up to 3 seconds, because a new Rex pane may not be attached to the app when it starts, and it returns whatever arrived by then.

## Mixing

`Mix(a, b, t)` moves from `a` toward `b`. radar draws its body text at `Mix(fg, bg, 0.30)`, its faint text at `0.52` and its idle dot at `0.68`, so every grey belongs to the user's theme.

## Reading replies

termcolor never reads stdin. Your input loop already owns it, so decode OSC replies there and pass the bodies in on the `replies` channel.
