---
title: cliout
description: One exit code table, errors that carry a code, and JSON that suits its reader.
group: craftkit
---

**cliout gives every tool the same exit codes, so scripts and agents can branch on them.**

| Code | Constant | Meaning |
|---|---|---|
| `0` | `OK` | Success |
| `1` | `Failure` | The command ran and failed |
| `2` | `Usage` | Invalid command line |
| `3` | `NotFound` | Target not found or ambiguous |
| `4` | `Unreachable` | Server or dependency unreachable |
| `130` | `Interrupted` | Interrupted |

```go
func main() {
	err := run(os.Args[1:])
	os.Exit(cliout.Fail(os.Stderr, "mytool", err)) // prints "mytool: ..." and picks the code
}

return cliout.Errorf(cliout.NotFound, "no agent matches %q", target)
cliout.JSON(os.Stdout, result)
```

## Errors

`Fail` prefixes the message with the tool name on stderr and returns the code the error carries. A cancelled context gives `130`, and any other error gives `1`. Write the message so it names the value involved and the fix.

## JSON

`JSON` indents for a person at a terminal and prints compact output when piped, so `| jq` stays fast and a human can still read it.
