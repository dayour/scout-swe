---
id: a2a
title: Agent2Agent (A2A)
---

# Agent2Agent (A2A)

`@scout-swe/a2a` defines a small, transport-agnostic protocol: agents publish an
`AgentCard`; peers exchange `A2AMessage` envelopes that carry typed `A2APart`
content and drive `A2ATask` lifecycles. JSON Schemas ship in the package.

```ts
import { textMessage, newTask, messageText } from "@scout-swe/a2a";
import { A2AClient } from "@scout-swe/sdk";

const msg = textMessage("scan the repo and open issues");
const peer = new A2AClient("https://agent.example.com");
const card = await peer.card();        // GET /.well-known/agent-card.json
const task = await peer.send(msg);     // POST /a2a/messages
```

## Task states

`submitted -> working -> input-required -> completed | failed | canceled`

## Schemas

- `@scout-swe/a2a/schema/message` - `a2a-message.schema.json`
- `@scout-swe/a2a/schema/agent-card` - `agent-card.schema.json`
