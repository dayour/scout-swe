/**
 * Basic SDK example: query the Scout control plane.
 * Run with: npx tsx examples/basic-client.ts
 * Env: SCOUT_GATEWAY (default http://localhost:9000)
 */
import { ScoutClient, defaultPolicy, renderPolicy } from "@scout-swe/sdk";

const scout = new ScoutClient({ baseUrl: process.env.SCOUT_GATEWAY ?? "http://localhost:9000" });

const health = await scout.health();
console.log("health:", health);

const catalog = await scout.catalog();
console.log("DLMCP resource counts:", catalog.counts);

const nodes = await scout.listNodes();
for (const node of nodes) {
  console.log(`node ${node.id} (${node.platform}) ${node.ip ?? ""} -> ${node.status}`);
}

const linux = renderPolicy(defaultPolicy(), "linux");
console.log("linux policy path:", linux.path);
