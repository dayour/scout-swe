---
id: getting-started
title: Getting started
---

# Getting started

## Prerequisites

- Node.js 20+
- A reachable Scout gateway (the DarbotLM gateway serving `/scout`, e.g. `http://10.1.8.69:9000`)

## Install & build

```bash
git clone https://github.com/dayour/scout-swe.git
cd scout-swe
npm install
npm run build      # tsc project references across all packages
npm test           # vitest
npm run docs:build # this site
```

## Use the SDK

```ts
import { ScoutClient, defaultPolicy, renderPolicy } from "@scout-swe/sdk";

const scout = new ScoutClient({ baseUrl: "http://10.1.8.69:9000" });

const health = await scout.health();
const catalog = await scout.catalog();   // every DLMCP resource
const nodes = await scout.listNodes();    // the Microsoft Scout fleet

// Render the Linux managed policy that enables Frontier
const linux = renderPolicy(defaultPolicy(), "linux");
console.log(linux.path); // /etc/clawpilot/policy.json
```

## Use the CLI

```bash
SCOUT_GATEWAY=http://10.1.8.69:9000 npx scout-swe health
npx scout-swe nodes
npx scout-swe dispatch "prep weekly review" --node smax-scout
```
