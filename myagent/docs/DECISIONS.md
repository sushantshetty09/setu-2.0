# Architecture & Design Decisions

Logged automatically as the project is built.  Each entry explains *why*
a choice was made so future-you (or a contributor) doesn't have to guess.

---

## M1: Foundation

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Project lives at `myagent/` inside the workspace, with its own git repo | Keeps it independent of the parent project while staying in the workspace |
| 2 | Use `tomllib` (stdlib 3.11+) for reading TOML; `tomli-w` only for writing | Zero extra deps for the read path, which is the hot path |
| 3 | `model/base.py` defines `Reply`, `ToolCall`, `Usage` as frozen dataclasses | Immutable value objects are easier to reason about and test |
| 4 | Only `ollama_client.py` may `import ollama` | Single point of change if the backend library changes |
| 5 | Config is a frozen Pydantic model — no mutation after load | Prevents accidental mid-run config changes; CLI restarts are cheap |
| 6 | Tool count kept to exactly 6 model-facing tools | Small models get confused with >10 tools; 6 covers all needs |
| 7 | Named the logging module `event_log.py` not `logging.py` | Avoids shadowing stdlib `logging` which breaks third-party libraries |
