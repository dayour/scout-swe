# Automations

Scheduled, declarative automations for Scout SWE. Each definition in
`scheduled/*.json` is dispatched as a Scout task through the gateway scout-api by
`run.mjs`.

## Definition shape

```json
{
  "id": "weekly-fleet-report",
  "title": "Weekly Scout fleet report",
  "schedule": "0 13 * * 1",
  "prompt": "Summarize Scout fleet health...",
  "nodeId": null
}
```

| Field | Meaning |
|-------|---------|
| `id` | unique automation id |
| `title` | task title dispatched to Scout |
| `schedule` | cron expression (documentation; the `.github/workflows/automations.yml` cron drives execution) |
| `prompt` | natural-language task body |
| `nodeId` | optional target Scout fleet node |

## Run

```bash
# dry-run (no dispatch)
SCOUT_DRY_RUN=1 node automations/run.mjs

# live (requires a reachable gateway)
SCOUT_GATEWAY=https://scout-gateway.example.com node automations/run.mjs
```

CI runs this weekly in dry-run via `automations.yml`.
