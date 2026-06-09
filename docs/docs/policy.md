---
id: policy
title: Managed policy
---

# Managed policy

Scout is governed by a single policy object that renders to each platform's
native surface. The field names below are the camelCase keys used by the
Microsoft Scout Linux loader.

| Platform | Target | Key style |
|----------|--------|-----------|
| Linux | `/etc/clawpilot/policy.json` | camelCase JSON |
| Windows | `HKLM\SOFTWARE\Policies\Scout` | PascalCase registry values |
| macOS | `com.microsoft.clawpilot` managed preferences | PascalCase keys |

```ts
import { defaultPolicy, renderPolicy } from "@scout-swe/sdk";

const policy = defaultPolicy();                 // allowScoutFrontierAccess: true
renderPolicy(policy, "linux").content;          // -> /etc/clawpilot/policy.json body
renderPolicy(policy, "windows").values;         // -> HKLM values (DWORD/REG_SZ)
```

## Fields

`version`, `allowScoutFrontierAccess`, `forcePrompt`, `restrictToWorkspace`,
`disableHeartbeat`, `disableAutomations`, `disabledServers[]`, `disabledModels[]`,
`disabledProviders[]`, `disabledPermissionKinds[]`, `browserEgressBlockedOrigins[]`.

> Note: on Linux the loader reads camelCase keys; the Windows/macOS surfaces use
> PascalCase value names. `renderPolicy` handles the translation.
