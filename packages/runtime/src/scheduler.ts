export type HeartbeatCallback = (tick: number) => void | Promise<void>;

export interface SchedulerOptions {
  /** Heartbeat interval in ms (default 60000). */
  intervalMs?: number;
}

/**
 * Minimal heartbeat/automation scheduler. Registers callbacks fired on each
 * heartbeat tick; supports start/stop. Mirrors Scout's heartbeat/automations.
 */
export class Scheduler {
  private readonly intervalMs: number;
  private readonly callbacks: HeartbeatCallback[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private tick = 0;

  constructor(options: SchedulerOptions = {}) {
    this.intervalMs = options.intervalMs ?? 60_000;
  }

  onHeartbeat(cb: HeartbeatCallback): this {
    this.callbacks.push(cb);
    return this;
  }

  start(): this {
    if (this.timer) return this;
    this.timer = setInterval(() => void this.fire(), this.intervalMs);
    if (typeof this.timer === "object" && "unref" in this.timer) {
      (this.timer as { unref: () => void }).unref();
    }
    return this;
  }

  stop(): this {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    return this;
  }

  /** Fire one heartbeat immediately (also used internally by the timer). */
  async fire(): Promise<void> {
    this.tick += 1;
    for (const cb of this.callbacks) {
      await cb(this.tick);
    }
  }
}
