---
id: runtime
title: Runtime (@scout-swe/runtime)
---

# Runtime

An in-process runtime for tasks, sessions, A2A, and scheduling. It is
compatible with the standalone [aether](https://github.com/dayour/aether)
runtime - `aether` provides the sandboxed, out-of-process implementation of the
same contracts.

```ts
import { ScoutRuntime, Scheduler, createA2AHandler, LoopbackTransport } from "@scout-swe/runtime";
import { textMessage } from "@scout-swe/a2a";

const rt = new ScoutRuntime();
const task = await rt.dispatch({ title: "build", prompt: "compile and test" });

// Answer A2A messages locally
const transport = new LoopbackTransport(createA2AHandler(rt));
const reply = await transport.send(textMessage("scan the repo"));

// Heartbeat / automations
new Scheduler({ intervalMs: 60_000 })
  .onHeartbeat((tick) => console.log("tick", tick))
  .start();
```

## Custom executors

Implement `TaskExecutor` to perform real work (e.g. dispatch to a Scout fleet
node). The default `RecordExecutor` records tasks without remote side effects.
