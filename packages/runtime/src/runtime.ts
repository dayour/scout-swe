import type { A2AMessage, A2ATask } from "@scout-swe/a2a";
import { messageText, newTask } from "@scout-swe/a2a";
import type { DispatchTaskRequest, ScoutSession, ScoutTask, ScoutTaskStatus } from "@scout-swe/sdk";

let counter = 0;
function rid(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}

/** Pluggable execution strategy for a dispatched task. */
export interface TaskExecutor {
  execute(task: ScoutTask): Promise<{ status: ScoutTaskStatus; result: Record<string, unknown> }>;
}

/** Default executor: records the task without performing remote actions. */
export class RecordExecutor implements TaskExecutor {
  async execute(task: ScoutTask) {
    return {
      status: "succeeded" as ScoutTaskStatus,
      result: { executor: "record", taskId: task.id, note: "recorded by ScoutRuntime" },
    };
  }
}

export interface ScoutRuntimeOptions {
  executor?: TaskExecutor;
}

/**
 * Aether-compatible in-process runtime for Scout SWE. Holds task and session
 * state, runs tasks through a {@link TaskExecutor}, and answers A2A messages.
 */
export class ScoutRuntime {
  private readonly tasks = new Map<string, ScoutTask>();
  private readonly sessions = new Map<string, ScoutSession>();
  private readonly executor: TaskExecutor;

  constructor(options: ScoutRuntimeOptions = {}) {
    this.executor = options.executor ?? new RecordExecutor();
  }

  async dispatch(req: DispatchTaskRequest): Promise<ScoutTask> {
    const now = new Date().toISOString();
    const task: ScoutTask = {
      id: rid("task"),
      title: req.title,
      status: "dispatched",
      nodeId: req.nodeId,
      targetRef: req.target,
      prompt: req.prompt,
      payload: req.payload ?? {},
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(task.id, task);
    const outcome = await this.executor.execute(task);
    task.status = outcome.status;
    task.result = outcome.result;
    task.updatedAt = new Date().toISOString();
    return task;
  }

  getTask(id: string): ScoutTask | undefined {
    return this.tasks.get(id);
  }
  listTasks(): ScoutTask[] {
    return [...this.tasks.values()];
  }

  openSession(nodeId?: string, model?: string): ScoutSession {
    const session: ScoutSession = {
      id: rid("sess"),
      nodeId,
      model,
      status: "active",
      startedAt: new Date().toISOString(),
    };
    this.sessions.set(session.id, session);
    return session;
  }
  listSessions(): ScoutSession[] {
    return [...this.sessions.values()];
  }

  /** Handle an inbound A2A message by turning it into a task and replying. */
  async handleA2A(message: A2AMessage): Promise<A2ATask> {
    const task = newTask(message);
    const dispatched = await this.dispatch({ title: messageText(message) || "a2a task", prompt: messageText(message) });
    task.state = dispatched.status === "succeeded" ? "completed" : "working";
    task.result = [{ kind: "data", mimeType: "application/json", data: dispatched.result ?? {} }];
    task.updatedAt = new Date().toISOString();
    return task;
  }
}
