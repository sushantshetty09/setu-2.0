"""
Ollama model client — the ONLY module that may ``import ollama``.

Translates between the ``ollama`` library's types and our ``Reply`` /
``ToolCall`` abstractions so the rest of the codebase stays engine-agnostic.
"""

from __future__ import annotations

import uuid
from typing import Any, Generator

from myagent.model.base import ModelClient, Reply, StreamingReply, ToolCall, Usage

# Guard the import so tests that don't need Ollama can still import the module
# and check ``OLLAMA_AVAILABLE`` before instantiating.
try:
    import ollama as _ollama

    OLLAMA_AVAILABLE = True
except ImportError:
    _ollama = None  # type: ignore[assignment]
    OLLAMA_AVAILABLE = False


def _convert_tool_calls(raw_calls: list[Any] | None) -> list[ToolCall]:
    """Convert Ollama's tool-call objects to our ToolCall dataclass."""
    if not raw_calls:
        return []
    result: list[ToolCall] = []
    for call in raw_calls:
        fn = call.function if hasattr(call, "function") else call.get("function", {})
        name = fn.name if hasattr(fn, "name") else fn.get("name", "")
        args = fn.arguments if hasattr(fn, "arguments") else fn.get("arguments", {})
        # Ensure args is a dict (sometimes arrives as a string)
        if isinstance(args, str):
            import json

            try:
                args = json.loads(args)
            except json.JSONDecodeError:
                args = {"_raw": args}
        result.append(ToolCall(id=uuid.uuid4().hex[:8], name=name, arguments=dict(args)))
    return result


class OllamaClient(ModelClient):
    """
    Talks to an Ollama instance over its local HTTP API.

    Args:
        model: Ollama model tag, e.g. ``"qwen3:8b"``.
        host:  Base URL, default ``http://localhost:11434``.
        num_ctx: Context window size in tokens.
        temperature: Sampling temperature.
    """

    def __init__(
        self,
        model: str,
        host: str = "http://localhost:11434",
        num_ctx: int = 16384,
        temperature: float = 0.2,
    ) -> None:
        if not OLLAMA_AVAILABLE:
            raise RuntimeError(
                "The 'ollama' package is not installed.  Run: pip install ollama"
            )
        self.model = model
        self.num_ctx = num_ctx
        self.temperature = temperature
        self._client = _ollama.Client(host=host)

    # -- non-streaming ---------------------------------------------------------

    def _chat_sync(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None,
    ) -> Reply:
        kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "options": {"num_ctx": self.num_ctx, "temperature": self.temperature},
            "stream": False,
        }
        if tools:
            kwargs["tools"] = tools

        resp = self._client.chat(**kwargs)
        msg = resp.message if hasattr(resp, "message") else resp.get("message", {})
        content = msg.content if hasattr(msg, "content") else msg.get("content", "")
        raw_tc = msg.tool_calls if hasattr(msg, "tool_calls") else msg.get("tool_calls")
        tool_calls = _convert_tool_calls(raw_tc)

        # Usage stats (Ollama doesn't always provide them)
        prompt_tokens = getattr(resp, "prompt_eval_count", 0) or 0
        completion_tokens = getattr(resp, "eval_count", 0) or 0

        return Reply(
            text=content or "",
            tool_calls=tool_calls,
            usage=Usage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens,
            ),
        )

    # -- streaming -------------------------------------------------------------

    def _chat_stream(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None,
    ) -> StreamingReply:
        kwargs: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "options": {"num_ctx": self.num_ctx, "temperature": self.temperature},
            "stream": True,
        }
        if tools:
            kwargs["tools"] = tools

        full_text = ""
        all_tool_calls: list[ToolCall] = []
        prompt_tokens = 0
        completion_tokens = 0

        for chunk in self._client.chat(**kwargs):
            msg = chunk.message if hasattr(chunk, "message") else chunk.get("message", {})
            content = msg.content if hasattr(msg, "content") else msg.get("content", "")
            if content:
                full_text += content
                yield content  # stream text chunk to caller

            raw_tc = msg.tool_calls if hasattr(msg, "tool_calls") else msg.get("tool_calls")
            all_tool_calls.extend(_convert_tool_calls(raw_tc))

            # Accumulate usage from the final chunk (Ollama sends it on the last one)
            prompt_tokens = getattr(chunk, "prompt_eval_count", 0) or prompt_tokens
            completion_tokens = getattr(chunk, "eval_count", 0) or completion_tokens

        return Reply(
            text=full_text,
            tool_calls=all_tool_calls,
            usage=Usage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens,
            ),
        )

    # -- public interface ------------------------------------------------------

    def chat(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        stream: bool = False,
    ) -> Reply | StreamingReply:
        if stream:
            return self._chat_stream(messages, tools)
        return self._chat_sync(messages, tools)
