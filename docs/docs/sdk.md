---
id: sdk
title: SDK (@scout-swe/sdk)
---

# SDK

Typed TypeScript client for the Scout API.

```ts
import { ScoutClient } from "@scout-swe/sdk";

const gateway = process.env.SCOUT_GATEWAY;
if (!gateway) throw new Error("SCOUT_GATEWAY is required");

const scout = new ScoutClient({ baseUrl: gateway });
```

## Methods

| Method | Endpoint |
|--------|----------|
| `health()` | `GET /scout/health` |
| `info()` | `GET /scout/info` |
| `catalog()` | `GET /scout/catalog` |
| `fleet()` | `GET /scout/fleet` |
| `listNodes()` / `getNode(id)` | `GET /scout/nodes[/{id}]` |
| `listAgents()` | `GET /scout/agents` |
| `getPolicy(allowFrontier?)` | `GET /scout/policy` |
| `renderPolicy(platform, policy?)` | `POST /scout/policy/render` |
| `listSessions()` / `openSession()` | `GET/POST /scout/sessions` |
| `listTasks()` / `dispatchTask()` / `getTask(id)` | `GET/POST /scout/tasks` |

Errors throw `ScoutApiError` with `status`, `url`, and parsed `body`.

## Policy helpers

`defaultPolicy()`, `renderPolicy(policy, platform)`, `toLinuxJson`,
`toWindowsRegistry`, `toMacosDefaults` mirror the verified Scout policy surfaces
(`/etc/clawpilot/policy.json`, `HKLM\SOFTWARE\Policies\Scout`,
`com.microsoft.clawpilot`).
