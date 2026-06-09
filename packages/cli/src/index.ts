#!/usr/bin/env node
/**
 * scout-swe - command line over the DarbotLM Scout control plane.
 *
 *   scout-swe health
 *   scout-swe info
 *   scout-swe nodes
 *   scout-swe catalog
 *   scout-swe policy [--platform linux|windows|macos]
 *   scout-swe dispatch "<title>" [--prompt P] [--node ID]
 *
 * Env: SCOUT_GATEWAY (default http://localhost:9000)
 */
import { ScoutClient } from "@scout-swe/sdk";

const gateway = process.env.SCOUT_GATEWAY ?? "http://localhost:9000";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function print(data: unknown): void {
  process.stdout.write(JSON.stringify(data, null, 2) + "\n");
}

async function main(): Promise<number> {
  const [command, positional] = [process.argv[2], process.argv[3]];
  const client = new ScoutClient({ baseUrl: gateway });

  switch (command) {
    case "health": {
      const h = await client.health();
      process.stdout.write(`[${h.status === "ok" ? "OK" : "ERROR"}] scout-api ${h.status} fleetNodes=${h.fleetNodes}\n`);
      return h.status === "ok" ? 0 : 1;
    }
    case "info":
      print(await client.info());
      return 0;
    case "nodes":
      print(await client.listNodes());
      return 0;
    case "catalog":
      print(await client.catalog());
      return 0;
    case "policy": {
      const platform = arg("--platform");
      const policy = await client.getPolicy();
      if (platform === "linux" || platform === "windows" || platform === "macos") {
        print(await client.renderPolicy(platform, policy));
      } else {
        print(policy);
      }
      return 0;
    }
    case "dispatch": {
      if (!positional) {
        process.stderr.write('[ERROR] usage: scout-swe dispatch "<title>" [--prompt P] [--node ID]\n');
        return 2;
      }
      const task = await client.dispatchTask({ title: positional, prompt: arg("--prompt"), nodeId: arg("--node") });
      process.stdout.write(`[OK] task ${task.id} status=${task.status}\n`);
      return 0;
    }
    default:
      process.stdout.write(
        "scout-swe <command>\n\n" +
          "Commands: health, info, nodes, catalog, policy [--platform], dispatch \"<title>\"\n" +
          `Gateway: ${gateway} (set SCOUT_GATEWAY to override)\n`,
      );
      return command ? 1 : 0;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    process.stderr.write(`[ERROR] ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  });
