# Examples

Runnable examples. Build the workspace first (`npm install && npm run build`),
then run with [tsx](https://github.com/privatenumber/tsx):

```bash
npx tsx examples/basic-client.ts        # SDK against a live gateway
npx tsx examples/a2a-roundtrip.ts       # A2A round-trip via the local runtime
```

Set `SCOUT_GATEWAY` to point at a Scout gateway (default `http://localhost:9000`).
