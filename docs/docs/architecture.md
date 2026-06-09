---
id: architecture
title: Architecture
---

# Architecture

```
+----------------------------------------------------------+
|                        weave                             |
|   SWE-swarm orchestration: agent/tool DAG, routing,      |
|   full APIM routing for A2A + MCP                         |
+--------------------------+-------------------------------+
                           | composes
+--------------------------v-------------------------------+
|                       scout-swe                          |
|   SDK | A2A | CLI | APIM | automations | docs            |
+--------------------------+-------------------------------+
                           | runs on
+--------------------------v-------------------------------+
|                        aether                            |
|   runtime: executor, scheduler/heartbeat, A2A transport  |
+--------------------------+-------------------------------+
                           | calls
+--------------------------v-------------------------------+
|              DarbotLM gateway  (/scout)                  |
|   scout-api  ->  Microsoft Scout fleet + DLMCP resources |
+----------------------------------------------------------+
```

## Surfaces

- **SDK** talks to the gateway `scout-api` (`/scout/*`).
- **A2A** lets agents exchange messages and run tasks peer-to-peer.
- **Runtime** executes tasks and answers A2A messages (compatible with `aether`).
- **APIM** fronts the gateway and routes `/a2a/*` and `/mcp/*`.
- **Automations** dispatch scheduled Scout tasks.

See [SDK](sdk), [A2A](a2a), [Runtime](runtime), [APIM](apim), and [Policy](policy).
