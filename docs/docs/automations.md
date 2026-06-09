---
id: automations
title: Automations
---

# Automations

Declarative, scheduled Scout tasks. Each `automations/scheduled/*.json` is
dispatched through the Scout API by `automations/run.mjs`.

```json
{
  "id": "weekly-fleet-report",
  "title": "Weekly Scout fleet report",
  "schedule": "0 13 * * 1",
  "prompt": "Summarize Scout fleet health and pending tasks.",
  "nodeId": null
}
```

```bash
SCOUT_DRY_RUN=1 node automations/run.mjs                 # CI-safe
SCOUT_GATEWAY=http://10.1.8.69:9000 node automations/run.mjs
```

The `.github/workflows/automations.yml` workflow runs these weekly (dry-run in CI).
