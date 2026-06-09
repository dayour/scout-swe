import { describe, expect, it, vi } from "vitest";
import { ScoutClient } from "../src/client.js";
import { defaultPolicy, toWindowsRegistry, renderPolicy } from "../src/policy.js";
import type { ScoutHealth } from "../src/types.js";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("ScoutClient", () => {
  it("builds the /scout base URL and parses health", async () => {
    const fakeFetch = vi.fn(async (_url: string | URL | Request) =>
      jsonResponse({ status: "ok", component: "scout-api", version: "1.0.0", fleetNodes: 1, controlAgents: 1 } satisfies ScoutHealth),
    );
    const client = new ScoutClient({ baseUrl: "http://host:9000/", fetch: fakeFetch as unknown as typeof fetch });
    const health = await client.health();
    expect(health.status).toBe("ok");
    expect(fakeFetch).toHaveBeenCalledWith("http://host:9000/scout/health", expect.objectContaining({ method: "GET" }));
  });

  it("dispatches a task with a JSON body", async () => {
    const fakeFetch = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(init?.method).toBe("POST");
      expect(JSON.parse(String(init?.body))).toMatchObject({ title: "do it" });
      return jsonResponse({ id: "task-1", title: "do it", status: "dispatched", payload: {}, createdAt: "", updatedAt: "" });
    });
    const client = new ScoutClient({ baseUrl: "http://host:9000", fetch: fakeFetch as unknown as typeof fetch });
    const task = await client.dispatchTask({ title: "do it" });
    expect(task.status).toBe("dispatched");
  });

  it("throws ScoutApiError on non-2xx", async () => {
    const fakeFetch = vi.fn(async () => jsonResponse({ detail: "nope" }, 404));
    const client = new ScoutClient({ baseUrl: "http://host:9000", fetch: fakeFetch as unknown as typeof fetch });
    await expect(client.getNode("missing")).rejects.toThrowError(/404/);
  });
});

describe("policy", () => {
  it("default policy enables Frontier", () => {
    expect(defaultPolicy().allowScoutFrontierAccess).toBe(true);
  });

  it("renders Windows registry values with PascalCase + DWORD", () => {
    const reg = toWindowsRegistry(defaultPolicy());
    expect(reg.AllowScoutFrontierAccess).toBe(1);
    expect(reg.DisabledServers).toBe("");
  });

  it("renders the Linux policy path", () => {
    const r = renderPolicy(defaultPolicy(), "linux");
    expect(r.path).toBe("/etc/clawpilot/policy.json");
  });
});
