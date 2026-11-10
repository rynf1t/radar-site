---
title: Recipes
description: Small scripts and bindings built on radar.
group: Reference
---

**radar is a list you can script. These are the ones in daily use.**

## Is anything waiting on me?

```sh
radar ls --state blocked --json | jq -r '.agents[] | "\(.session): \(.msg)"'
```

## Jump to whatever needs me, from a key binding

```sh
radar focus
```

With no target, `focus` goes to the most urgent agent, the same one at the top of the pane.

## See a state without waiting for it

```sh
radar demo blocked --kind question --msg "Ship it?"
```

## Check what the pane draws

```sh
radar render -o radar.png --theme dark
```
