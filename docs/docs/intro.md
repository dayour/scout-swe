---
id: intro
title: Scout SWE
slug: /
---

# Scout SWE

A software-engineering framework and SDK for the **DarbotLM Scout control plane**
and the **Microsoft Scout fleet** (codename Clawpilot).

Scout SWE gives you a typed SDK, a runtime, an Agent2Agent (A2A) protocol layer,
API Management assets, automations, and this documentation site - everything you
need to build on Scout.

## Layers

Scout SWE is the framework layer of a three-repo stack:

| Repo | Role |
|------|------|
| [scout-swe](https://github.com/dayour/scout-swe) | framework, SDK, A2A, APIM, docs (this repo) |
| [aether](https://github.com/dayour/aether) | the agent execution runtime |
| [weave](https://github.com/dayour/weave) | the SWE-swarm orchestration / composition layer |

## What's inside

- **SDK** (`@scout-swe/sdk`) - typed client for the Scout API and A2A.
- **Runtime** (`@scout-swe/runtime`) - task/session execution, A2A transport, scheduler.
- **A2A** (`@scout-swe/a2a`) - Agent2Agent protocol types and JSON Schemas.
- **CLI** (`@scout-swe/cli`) - `scout-swe` command line.
- **APIM** - OpenAPI + Azure API Management policies (incl. A2A/MCP routing).
- **Python bindings** (`scout_swe`) - httpx + pydantic client.
- **Automations** - scheduled, declarative Scout tasks.

Continue with [Getting started](getting-started).
