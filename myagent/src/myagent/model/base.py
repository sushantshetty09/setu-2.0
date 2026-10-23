"""
Abstract base for model clients.

Every model backend (Ollama, llama-cpp-python, a test fake) implements
``ModelClient``.  The rest of the codebase imports only this module for types,
keeping the agent independent of any specific inference engine.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Generator


@dataclass(frozen=True)
class ToolCall:
    """A single tool invocation requested by the model."""

    id: str
    name: str
    arguments: dict[str, Any]


@dataclass(frozen=True)
class Usage:
    """Token counts for a single model call (all optional, not every backend reports them)."""

    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0


@dataclass
class Reply:
    """
    The model's response to a ``chat()`` call.

    Exactly one of ``text`` and ``tool_calls`` is typically non-empty:
    - text only → the model considers the task done (or is asking a question).
    - tool_calls only → the model wants the agent loop to execute tools.
    - both → rare, but the loop should process tool_calls first.
    """

    text: str = ""
    tool_calls: list[ToolCall] = field(default_factory=list)
    usage: Usage = field(default_factory=Usage)


# Type alias for a streaming generator: yields text chunks, returns the final Reply.
StreamingReply = Generator[str, None, Reply]


class ModelClient(ABC):
    """
    Interface that every model backend must implement.

    The agent loop only ever calls ``chat()``; everything engine-specific
    stays behind this boundary.
    """

    @abstractmethod
    def chat(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        stream: bool = False,
    ) -> Reply | StreamingReply:
        """
        Send a conversation and (optionally) a tool list to the model.

        Args:
            messages: The conversation so far (system, user, assistant, tool roles).
            tools:    JSON-schema tool definitions the model may invoke.
            stream:   If True, return a ``StreamingReply`` generator that yields
                      text chunks and whose return value is the final ``Reply``.

        Returns:
            A ``Reply`` (non-streaming) or a ``StreamingReply`` generator.
        """
        ...
