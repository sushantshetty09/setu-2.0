"""
Configuration system with layered loading priority.

Load order (each layer overrides the previous):
1. Built-in defaults
2. Global config: ~/.config/myagent/config.toml (Linux/macOS) or %APPDATA%/myagent/config.toml (Windows)
3. Project config: <project_root>/.myagent/config.toml
4. CLI flags (handled at the call site, not here)
"""

from __future__ import annotations

import platform
import tomllib
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field


class PermissionConfig(BaseModel):
    """Controls how the agent asks for permission before writing or running commands."""

    # "default" = ask before writes/commands, "plan" = read-only, "auto" = no prompts (--yolo)
    mode: str = Field(default="default", pattern=r"^(default|plan|auto)$")


class Config(BaseModel):
    """All settings for myagent. Immutable once loaded."""

    model: str = Field(default="qwen3:8b", description="Ollama model tag to use")
    host: str = Field(default="http://localhost:11434", description="Ollama API base URL")
    num_ctx: int = Field(default=16384, ge=1024, description="Context window size in tokens")
    temperature: float = Field(default=0.2, ge=0.0, le=2.0)
    max_steps: int = Field(default=25, ge=1, description="Max tool-call iterations per request")
    command_timeout: int = Field(default=120, ge=1, description="Seconds before a command is killed")
    output_cap: int = Field(default=6000, ge=100, description="Max characters kept from tool output")
    permissions: PermissionConfig = Field(default_factory=PermissionConfig)

    model_config = {"frozen": True}


def _global_config_dir() -> Path:
    """Platform-appropriate global config directory."""
    system = platform.system()
    if system == "Windows":
        # %APPDATA% is always set on Windows; fall back to ~/AppData/Roaming
        import os
        base = Path(os.environ.get("APPDATA", Path.home() / "AppData" / "Roaming"))
    elif system == "Darwin":
        base = Path.home() / "Library" / "Application Support"
    else:
        # XDG_CONFIG_HOME or ~/.config on Linux / BSDs
        import os
        base = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config"))
    return base / "myagent"


def _load_toml(path: Path) -> dict[str, Any]:
    """Read a TOML file and return its contents, or {} if it doesn't exist."""
    if not path.is_file():
        return {}
    with open(path, "rb") as f:
        return tomllib.load(f)


def _deep_merge(base: dict, override: dict) -> dict:
    """Recursively merge *override* into *base* (neither is mutated)."""
    merged = dict(base)
    for key, value in override.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def load_config(
    project_root: Path | None = None,
    cli_overrides: dict[str, Any] | None = None,
) -> Config:
    """
    Build a Config by layering defaults → global → project → CLI.

    Args:
        project_root: The folder the agent is running in (cwd by default).
        cli_overrides: Flat dict of overrides from command-line flags.
                       Nested keys use dots: ``{"permissions.mode": "auto"}``.
    """
    # Layer 1: defaults are baked into the Pydantic model
    merged: dict[str, Any] = {}

    # Layer 2: global config
    global_path = _global_config_dir() / "config.toml"
    merged = _deep_merge(merged, _load_toml(global_path))

    # Layer 3: project config
    if project_root is None:
        project_root = Path.cwd()
    project_path = project_root / ".myagent" / "config.toml"
    merged = _deep_merge(merged, _load_toml(project_path))

    # Layer 4: CLI overrides (dot-separated keys → nested dicts)
    if cli_overrides:
        for dotted_key, value in cli_overrides.items():
            parts = dotted_key.split(".")
            d = merged
            for part in parts[:-1]:
                d = d.setdefault(part, {})
            d[parts[-1]] = value

    return Config(**merged)
