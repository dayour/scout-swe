import { describe, expect, it } from "vitest";
import { ScoutRuntime, Scheduler, LoopbackTransport, createA2AHandler } from "../src/index.js";
import { textMessage } from "@scout-swe/a2a";

describe("ScoutRuntime", () => {
  it("dispatches and stores a task", async () => {
    const rt = new ScoutRuntime();
    const task = await rt.dispatch({ title: "build" });
    expect(task.status).toBe("succeeded");
    expect(rt.getTask(task.id)?.title).toBe("build");
    expect(rt.listTasks()).toHaveLength(1);
  });

  it("answers an A2A message through the loopback transport", async () => {
    const rt = new ScoutRuntime();
    const transport = new LoopbackTransport(createA2AHandler(rt));
    const reply = await transport.send(textMessage("scan the repo"));
    expect(reply.state).toBe("completed");
    expect(reply.result?.[0]?.kind).toBe("data");
  });

  it("opens sessions", () => {
    const rt = new ScoutRuntime();
    const s = rt.openSession("smax-scout", "gpt-5");
    expect(s.status).toBe("active");
    expect(rt.listSessions()).toHaveLength(1);
  });
});

describe("Scheduler", () => {
  it("fires heartbeat callbacks", async () => {
    const rt = new Scheduler({ intervalMs: 10 });
    let ticks = 0;
    rt.onHeartbeat(() => {
      ticks += 1;
    });
    await rt.fire();
    await rt.fire();
    expect(ticks).toBe(2);
  });
});
