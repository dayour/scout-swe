# APIM (API Management)

API Management assets that front the Scout control plane and the A2A / MCP
surfaces.

| File | Purpose |
|------|---------|
| `openapi/scout-api.yaml` | OpenAPI 3 definition of the Scout API (`/scout/*`). Import as the APIM API. |
| `policies/inbound.xml` | Base inbound policy: CORS, rate limiting, optional Entra JWT, backend. |
| `policies/a2a-mcp-routing.xml` | Routes `/a2a/*` and `/mcp/*` to their backends; everything else to the gateway. |

## Named values

Define these APIM named values (or replace inline):

| Name | Example |
|------|---------|
| `scout-gateway-url` | `https://scout-gateway.example.com` |
| `a2a-backend-url` | `https://scout-gateway.example.com` |
| `mcp-backend-url` | `https://scout-gateway.example.com` |

## Apply with the Azure CLI

```bash
az apim api import \
  --resource-group <rg> --service-name <apim> \
  --path scout --api-id scout \
  --specification-format OpenApi --specification-path openapi/scout-api.yaml

az apim api policy create \
  --resource-group <rg> --service-name <apim> --api-id scout \
  --xml-path policies/inbound.xml
```
