---
id: apim
title: API Management
---

# API Management

`apim/` fronts the Scout control plane and the A2A / MCP surfaces with Azure API
Management.

- `openapi/scout-api.yaml` - OpenAPI 3 definition (`/scout/*`).
- `policies/inbound.xml` - CORS, rate limiting, optional Entra JWT, backend.
- `policies/a2a-mcp-routing.xml` - routes `/a2a/*` and `/mcp/*` to their backends.

```bash
az apim api import \
  --resource-group <rg> --service-name <apim> \
  --path scout --api-id scout \
  --specification-format OpenApi --specification-path apim/openapi/scout-api.yaml
```

Named values: `scout-gateway-url`, `a2a-backend-url`, `mcp-backend-url`.
Populate them with deployment-specific HTTPS origins, such as
`https://scout-gateway.example.com`; do not commit tenant-specific values.

> The orchestration repo, [weave](https://github.com/dayour/weave), extends this
> with swarm-aware per-agent routing for A2A and MCP.
