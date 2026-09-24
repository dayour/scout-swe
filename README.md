# scout-swe

A software-engineering framework and SDK for the **DarbotLM Scout control plane**
and the **Microsoft Scout fleet** (codename Clawpilot).

scout-swe is the framework layer of a three-repo stack:

| Repo | Role |
|------|------|
| **scout-swe** (this repo) | framework, SDK, A2A, runtime, APIM, automations, docs |
| [aether](https://github.com/dayour/aether) | agent execution runtime (sandbox, scheduler/heartbeat, A2A transport) |
| [weave](https://github.com/dayour/weave) | SWE-swarm orchestration: agent/tool DAG with full APIM routing for A2A + MCP |

scout-swe runs on **aether** and is composed by **weave**.

## Packages

| Package | Description |
|---------|-------------|
| `@scout-swe/sdk` | Typed TypeScript client for the Scout API + policy helpers |
| `@scout-swe/a2a` | Agent2Agent protocol types + JSON Schemas |
| `@scout-swe/runtime` | Task/session execution, A2A transport, scheduler |
| `@scout-swe/cli` | `scout-swe` command line |
| `scout_swe` (Python) | httpx + pydantic bindings (`python/`) |

Plus: `apim/` (OpenAPI + Azure APIM policies incl. A2A/MCP routing), `automations/`
(scheduled Scout tasks), and `docs/` (Docusaurus).

## Quick start

```bash
npm install
npm run build        # tsc project references across packages
npm test             # vitest
npm run docs:build   # Docusaurus site
```

```ts
import { ScoutClient, defaultPolicy, renderPolicy } from "@scout-swe/sdk";

const gateway = process.env.SCOUT_GATEWAY;
if (!gateway) throw new Error("SCOUT_GATEWAY is required");

const scout = new ScoutClient({ baseUrl: gateway });
console.log(await scout.health());
console.log(await scout.catalog());            // every DLMCP resource
console.log(renderPolicy(defaultPolicy(), "linux").path); // /etc/clawpilot/policy.json
```

```bash
SCOUT_GATEWAY=https://scout-gateway.example.com npx scout-swe nodes
```

Set `SCOUT_GATEWAY` to the deployment-specific control-plane origin.

## Layout

```
packages/
  sdk/        @scout-swe/sdk      typed Scout API client + policy
  a2a/        @scout-swe/a2a      Agent2Agent types + schemas
  runtime/    @scout-swe/runtime  execution + transport + scheduler
  cli/        @scout-swe/cli      scout-swe command line
apim/         OpenAPI + Azure APIM policies (A2A/MCP routing)
python/       scout_swe Python bindings
docs/         Docusaurus site
automations/  scheduled Scout tasks
examples/     runnable examples
```

## Documentation

`npm run docs:start` for a local docs server, or browse `docs/docs/`.

## License

MIT (c) 2026 Daryl Yourk. See [LICENSE](LICENSE).
