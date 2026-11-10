---
title: skillkit
description: Ship the agent skill inside the binary and install it safely.
group: craftkit
---

**skillkit installs an agent skill embedded in your binary, so the skill can never drift from the version that runs.**

```go
//go:embed skills/mytool/SKILL.md
var skillMD []byte

s := skillkit.Skill{Name: "mytool", Tool: "mytool", Content: skillMD}
res, err := s.Install(skillkit.DefaultDir(), dryRun, force)
fmt.Println(s.Describe(res, false)) // "created ~/.claude/skills/mytool/SKILL.md"
```

## Results

| Result | Means |
|---|---|
| `created` | The skill wasn't there and now is |
| `unchanged` | The installed copy already matches |
| `outdated` | An older copy written by this tool was replaced |
| `foreign` | A file this tool didn't write is in the way. It is left alone. |

## Safety

The installed file gets a marker line after its front matter. `Install` only replaces files carrying its own marker, and `Remove` only deletes them. A file without the marker is `foreign` and stays put unless you pass `force`. Writes go through a temp file and a rename, so a crash never leaves half a skill.
