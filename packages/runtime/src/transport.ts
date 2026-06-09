import type { A2AMessage, A2ATask } from "@scout-swe/a2a";
import type { ScoutRuntime } from "./runtime.js";

/** A transport-agnostic A2A handler: message in, task out. */
export type A2AHandler = (message: A2AMessage) => Promise<A2ATask>;

/** Bind a runtime to an A2A handler usable by any HTTP/WS server. */
export function createA2AHandler(runtime: ScoutRuntime): A2AHandler {
  return (message) => runtime.handleA2A(message);
}

/**
 * In-process loopback transport for tests and local composition: deliver a
 * message straight into a handler without a network hop.
 */
export class LoopbackTransport {
  constructor(private readonly handler: A2AHandler) {}
  send(message: A2AMessage): Promise<A2ATask> {
    return this.handler(message);
  }
}
