#!/usr/bin/env node
// scout-swe automations runner.
// Loads automations/scheduled/*.json definitions and dispatches each as a Scout
// task via the gateway scout-api. Zero-dependency (Node 20+ global fetch).
//
// Env:
//   SCOUT_GATEWAY  gateway base URL (default http://localhost:9000)
//   SCOUT_DRY_RUN  "1" to load+log without dispatching (used by CI)
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const schedDir = join(here, "scheduled");
const gateway = process.env.SCOUT_GATEWAY ?? "http://localhost:9000";
const dryRun = process.env.SCOUT_DRY_RUN === "1";

async function loadDefs() {
  const files = (await readdir(schedDir)).filter((f) => f.endsWith(".json"));
  return Promise.all(files.map(async (f) => JSON.parse(await readFile(join(schedDir, f), "utf8"))));
}

async function runDef(def) {
  console.log(`[automation] ${def.id}: ${def.title} (schedule: ${def.schedule})`);
  if (dryRun) {
    console.log("  dry-run; not dispatching");
    return;
  }
  const res = await fetch(`${gateway}/scout/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: def.title, prompt: def.prompt ?? null, nodeId: def.nodeId ?? null }),
  });
  console.log(`  dispatched -> HTTP ${res.status}`);
}

const defs = await loadDefs();
console.log(`[automations] loaded ${defs.length} definition(s); gateway=${gateway}; dryRun=${dryRun}`);
for (const d of defs) {
  try {
    await runDef(d);
  } catch (e) {
    console.error(`  [ERROR] ${d.id}: ${e.message}`);
  }
}
