/**
 * A2A round-trip against the local runtime (no network).
 * Run with: npx tsx examples/a2a-roundtrip.ts
 */
import { ScoutRuntime, LoopbackTransport, createA2AHandler } from "@scout-swe/runtime";
import { textMessage, messageText } from "@scout-swe/a2a";

const runtime = new ScoutRuntime();
const transport = new LoopbackTransport(createA2AHandler(runtime));

const request = textMessage("scan the repo and summarize open work", "user");
console.log("sending:", messageText(request));

const task = await transport.send(request);
console.log("task state:", task.state);
console.log("result:", JSON.stringify(task.result, null, 2));
