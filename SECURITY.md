# Security Policy

## Reporting a vulnerability

Please report security issues privately via GitHub Security Advisories on this
repository (Security tab -> Report a vulnerability). Do not open public issues
for sensitive reports.

## Scope notes

- The SDK and runtime never log credentials. Tokens passed via `headers` are sent
  only to the configured gateway.
- The default runtime executor (`RecordExecutor`) performs no remote side effects.
- APIM policies include optional Entra ID JWT validation; enable it before exposing
  the Scout API beyond a trusted network.
