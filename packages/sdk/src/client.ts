import { ScoutApiError } from "./errors.js";
import type {
  DispatchTaskRequest,
  PolicyRenderResult,
  ScoutAgent,
  ScoutCatalog,
  ScoutFleet,
  ScoutHealth,
  ScoutNode,
  ScoutPlatform,
  ScoutPolicy,
  ScoutSession,
  ScoutTask,
} from "./types.js";

export interface ScoutClientOptions {
  /** Base gateway URL, default http://localhost:9000 */
  baseUrl?: string;
  /** Custom fetch (for tests / non-global environments). */
  fetch?: typeof fetch;
  /** Extra headers sent on every request (e.g. Authorization). */
  headers?: Record<string, string>;
  /** Per-request timeout in ms (default 60000). */
  timeoutMs?: number;
}

/**
 * Typed client for the DarbotLM Scout control plane (scout-api), served by the
 * gateway under `/scout`.
 *
 * @example
 * const scout = new ScoutClient({ baseUrl: "http://10.1.8.69:9000" });
 * const health = await scout.health();
 * const catalog = await scout.catalog();
 */
export class ScoutClient {
  private readonly base: string;
  private readonly doFetch: typeof fetch;
  private readonly headers: Record<string, string>;
  private readonly timeoutMs: number;

  constructor(options: ScoutClientOptions = {}) {
    this.base = (options.baseUrl ?? "http://localhost:9000").replace(/\/+$/, "") + "/scout";
    const f = options.fetch ?? globalThis.fetch;
    if (!f) {
      throw new Error("No fetch implementation available; pass options.fetch");
    }
    this.doFetch = f;
    this.headers = { accept: "application/json", ...options.headers };
    this.timeoutMs = options.timeoutMs ?? 60_000;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = this.base + path;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const init: RequestInit = { method, headers: { ...this.headers }, signal: controller.signal };
      if (body !== undefined) {
        init.body = JSON.stringify(body);
        (init.headers as Record<string, string>)["content-type"] = "application/json";
      }
      const res = await this.doFetch(url, init);
      const text = await res.text();
      const parsed = text ? safeJson(text) : undefined;
      if (!res.ok) {
        throw new ScoutApiError(`scout-api ${res.status} on ${method} ${path}`, res.status, url, parsed ?? text);
      }
      return parsed as T;
    } finally {
      clearTimeout(timer);
    }
  }

  // --- Health / info ---
  health(): Promise<ScoutHealth> {
    return this.request<ScoutHealth>("GET", "/health");
  }
  info(): Promise<Record<string, unknown>> {
    return this.request("GET", "/info");
  }
  manifest(): Promise<Record<string, unknown>> {
    return this.request("GET", "/manifest");
  }
  schema(): Promise<Record<string, unknown>> {
    return this.request("GET", "/schema");
  }

  // --- Catalog / fleet / nodes ---
  catalog(): Promise<ScoutCatalog> {
    return this.request<ScoutCatalog>("GET", "/catalog");
  }
  fleet(): Promise<ScoutFleet> {
    return this.request<ScoutFleet>("GET", "/fleet");
  }
  listNodes(): Promise<ScoutNode[]> {
    return this.request<ScoutNode[]>("GET", "/nodes");
  }
  getNode(id: string): Promise<ScoutNode> {
    return this.request<ScoutNode>("GET", `/nodes/${encodeURIComponent(id)}`);
  }
  listAgents(): Promise<ScoutAgent[]> {
    return this.request<ScoutAgent[]>("GET", "/agents");
  }

  // --- Policy ---
  getPolicy(allowFrontier = true): Promise<ScoutPolicy> {
    return this.request<ScoutPolicy>("GET", `/policy?allowFrontier=${allowFrontier ? "true" : "false"}`);
  }
  renderPolicy(platform: ScoutPlatform, policy?: ScoutPolicy): Promise<PolicyRenderResult> {
    return this.request<PolicyRenderResult>("POST", "/policy/render", { platform, policy: policy ?? null });
  }

  // --- Sessions / tasks ---
  listSessions(): Promise<ScoutSession[]> {
    return this.request<ScoutSession[]>("GET", "/sessions");
  }
  openSession(req: { nodeId?: string; model?: string } = {}): Promise<ScoutSession> {
    return this.request<ScoutSession>("POST", "/sessions", req);
  }
  listTasks(): Promise<ScoutTask[]> {
    return this.request<ScoutTask[]>("GET", "/tasks");
  }
  dispatchTask(req: DispatchTaskRequest): Promise<ScoutTask> {
    return this.request<ScoutTask>("POST", "/tasks", req);
  }
  getTask(id: string): Promise<ScoutTask> {
    return this.request<ScoutTask>("GET", `/tasks/${encodeURIComponent(id)}`);
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
