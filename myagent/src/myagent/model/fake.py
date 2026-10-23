"""
Fake (scripted) model client for deterministic testing.

You pre-load a list of ``Reply`` objects.  Each call to ``chat()`` pops
the next one off the queue, so tests can control exactly what the "model"
says without needing a GPU or Ollama running.

Usage in tests::

    from myagent.model.base import Reply, ToolCall
    from myagent.model.fake import FakeClient

    client = FakeClient([
        Reply(tool_calls=[ToolCall(id="1", name="list_dir", arguments={"path": "."})]),
        Reply(text="Done! I listed the directory."),
    ])
    r1 = client.chat([{"role": "user", "content": "list files"}])
    assert r1.tool_calls[0].name == "list_dir"
    r2 = client.chat([...])
    assert r2.text == "Done! I listed the directory."
"""

from __future__ import annotations

from typing import Any

from myagent.model.base import ModelClient, Reply, StreamingReply


class FakeClient(ModelClient):
    """
    Returns pre-scripted replies in order.

    Args:
        replies: A sequence of ``Reply`` objects to return one-by-one.
        loop:    If True, cycle back to the start when replies are exhausted
                 (useful for stress / long-loop tests).  Default False.
    """

    def __init__(self, replies: list[Reply], *, loop: bool = False) -> None:
        self._replies = list(replies)
        self._loop = loop
        self._index = 0

    @property
    def call_count(self) -> int:
        """How many times ``chat()`` has been called."""
        return self._index

    @property
    def exhausted(self) -> bool:
        return not self._loop and self._index >= len(self._replies)

    def chat(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]] | None = None,
        stream: bool = False,
    ) -> Reply | StreamingReply:
        if not self._replies:
            raise RuntimeError("FakeClient has no replies configured.")

        if self._index >= len(self._replies):
            if self._loop:
                self._index = 0
            else:
                # Return an empty final reply so the loop stops gracefully
                return Reply(text="[FakeClient: no more scripted replies]")

        reply = self._replies[self._index]
        self._index += 1

        if stream:
            return self._stream(reply)
        return reply

    @staticmethod
    def _stream(reply: Reply) -> StreamingReply:
        """Simulate streaming by yielding one character at a time."""
        for char in reply.text:
            yield char
        return reply
