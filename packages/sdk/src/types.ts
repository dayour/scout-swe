/**
 * Scout Cloud Object Model - TypeScript mirror of `scloud-om`.
 * Source of truth: dayour/scout-swe and the DarbotLM gateway scout-api.
 */

export type ScoutPlatform = "windows" | "macos" | "linux";

export type ScoutNodeStatus = "online" | "offline" | "waitlisted" | "unknown";

export type ScoutTaskStatus =
  | "pending"
  | "dispatched"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export type PermissionKind = "read" | "shell" | "write" | "mcp" | "url" | "custom-tool";

export interface ScoutResourceRef {
  apiVersion: "darbotlm/v1";
  kind: string;
  id: string;
  name?: string;
}

/** Scout managed policy. camelCase keys match the Linux /etc/clawpilot/policy.json loader. */
export interface ScoutPolicy {
  version: number;
  allowScoutFrontierAccess: boolean;
  forcePrompt: boolean;
  restrictToWorkspace: boolean;
  disableHeartbeat: boolean;
  disableAutomations: boolean;
  disabledServers: string[];
  disabledModels: string[];
  disabledProviders: string[];
  disabledPermissionKinds: string[];
  browserEgressBlockedOrigins: string[];
}

export interface ScoutNode {
  id: string;
  name: string;
  platform: ScoutPlatform;
  host?: string;
  ip?: string;
  scoutVersion?: string;
  status: ScoutNodeStatus;
  frontierEnabled: boolean;
  githubLogin?: string;
  tenant?: string;
  policy?: ScoutPolicy;
  capabilities: string[];
  labels: Record<string, string>;
  endpoints: Record<string, string>;
}

export interface ScoutAgent {
  id: string;
  name: string;
  agentType: string;
  description?: string;
  status: string;
  capabilities: string[];
  nodeRefs: ScoutResourceRef[];
  parameters: Record<string, unknown>;
}

export interface ScoutSession {
  id: string;
  nodeId?: string;
  status: string;
  model?: string;
  startedAt: string;
  endedAt?: string;
  summary?: string;
}

export interface ScoutTask {
  id: string;
  title: string;
  status: ScoutTaskStatus;
  nodeId?: string;
  targetRef?: ScoutResourceRef;
  prompt?: string;
  payload: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScoutFleet {
  nodes: ScoutNode[];
  agents: ScoutAgent[];
}

export interface ScoutResource {
  id: string;
  name: string;
  resourceType: string;
  category?: string;
  status?: string;
  endpoint?: string;
  capabilities: string[];
}

export interface ScoutCatalog {
  counts: Record<string, number>;
  resources: ScoutResource[];
  generatedAt: string;
}

export interface ScoutHealth {
  status: string;
  component: string;
  version: string;
  fleetNodes: number;
  controlAgents: number;
}

export interface PolicyRenderResult {
  platform: ScoutPlatform;
  render: Record<string, unknown>;
}

export interface DispatchTaskRequest {
  title: string;
  prompt?: string;
  nodeId?: string;
  target?: ScoutResourceRef;
  payload?: Record<string, unknown>;
}
