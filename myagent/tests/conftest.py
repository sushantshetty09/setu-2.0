"""Shared pytest fixtures for myagent tests."""

from __future__ import annotations

import os
from pathlib import Path

import pytest

from myagent.model.base import Reply, ToolCall
from myagent.model.fake import FakeClient


@pytest.fixture
def tmp_project(tmp_path: Path) -> Path:
    """Create a minimal fake project directory with a few files for testing."""
    (tmp_path / "src").mkdir()
    (tmp_path / "src" / "main.py").write_text("print('hello')\n", encoding="utf-8")
    (tmp_path / "README.md").write_text("# Test Project\n", encoding="utf-8")
    (tmp_path / "tests").mkdir()
    (tmp_path / "tests" / "test_main.py").write_text(
        "def test_placeholder():\n    assert True\n", encoding="utf-8"
    )
    return tmp_path


@pytest.fixture
def fake_client() -> FakeClient:
    """A FakeClient with a single 'done' reply — override in specific tests."""
    return FakeClient([Reply(text="Done.")])


def ollama_reachable() -> bool:
    """Check if Ollama is reachable on localhost (for integration test gating)."""
    try:
        import urllib.request
        host = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
        req = urllib.request.Request(f"{host}/api/version", method="GET")
        with urllib.request.urlopen(req, timeout=3):
            return True
    except Exception:
        return False


# Auto-skip integration tests when Ollama is not available
def pytest_collection_modifyitems(config: pytest.Config, items: list[pytest.Item]) -> None:
    if ollama_reachable():
        return
    skip_marker = pytest.mark.skip(reason="Ollama not reachable on localhost")
    for item in items:
        if "integration" in item.keywords:
            item.add_marker(skip_marker)
