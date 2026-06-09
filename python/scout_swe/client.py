"""Thin httpx client for the Scout control plane (scout-api)."""
from __future__ import annotations

from typing import Any, Dict, List, Optional

import httpx

from .models import ScoutNode, ScoutPolicy, ScoutTask


class ScoutClient:
    """Synchronous client for the gateway scout-api under /scout."""

    def __init__(self, base_url: str = "http://localhost:9000", timeout: float = 60.0) -> None:
        self.base = base_url.rstrip("/") + "/scout"
        self._client = httpx.Client(timeout=timeout, headers={"accept": "application/json"})

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "ScoutClient":
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def _get(self, path: str, **params: Any) -> Any:
        r = self._client.get(self.base + path, params=params or None)
        r.raise_for_status()
        return r.json()

    def _post(self, path: str, body: Dict[str, Any]) -> Any:
        r = self._client.post(self.base + path, json=body)
        r.raise_for_status()
        return r.json()

    def health(self) -> Dict[str, Any]:
        return self._get("/health")

    def info(self) -> Dict[str, Any]:
        return self._get("/info")

    def catalog(self) -> Dict[str, Any]:
        return self._get("/catalog")

    def nodes(self) -> List[ScoutNode]:
        return [ScoutNode(**n) for n in self._get("/nodes")]

    def policy(self, allow_frontier: bool = True) -> ScoutPolicy:
        return ScoutPolicy(**self._get("/policy", allowFrontier=str(allow_frontier).lower()))

    def render_policy(self, platform: str, policy: Optional[ScoutPolicy] = None) -> Dict[str, Any]:
        return self._post("/policy/render", {"platform": platform, "policy": policy.model_dump() if policy else None})

    def dispatch(self, title: str, prompt: Optional[str] = None, node_id: Optional[str] = None) -> ScoutTask:
        return ScoutTask(**self._post("/tasks", {"title": title, "prompt": prompt, "nodeId": node_id}))
