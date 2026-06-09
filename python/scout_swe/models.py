"""Pydantic models mirroring the Scout Cloud Object Model (scloud-om)."""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ScoutPolicy(BaseModel):
    version: int = 1
    allowScoutFrontierAccess: bool = False
    forcePrompt: bool = False
    restrictToWorkspace: bool = False
    disableHeartbeat: bool = False
    disableAutomations: bool = False
    disabledServers: List[str] = Field(default_factory=list)
    disabledModels: List[str] = Field(default_factory=list)
    disabledProviders: List[str] = Field(default_factory=list)
    disabledPermissionKinds: List[str] = Field(default_factory=list)
    browserEgressBlockedOrigins: List[str] = Field(default_factory=list)


class ScoutNode(BaseModel):
    id: str
    name: str
    platform: str
    ip: Optional[str] = None
    scoutVersion: Optional[str] = None
    status: str = "unknown"
    frontierEnabled: bool = False
    capabilities: List[str] = Field(default_factory=list)
    labels: Dict[str, str] = Field(default_factory=dict)


class ScoutTask(BaseModel):
    id: str
    title: str
    status: str = "pending"
    nodeId: Optional[str] = None
    prompt: Optional[str] = None
    payload: Dict[str, Any] = Field(default_factory=dict)
    result: Optional[Dict[str, Any]] = None
