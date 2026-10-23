"""
Minimal CLI entry point — will be fully built in Milestone 7.

For now, provides just enough to make ``myagent`` and ``python -m myagent``
work, and to run a basic smoke test of the config and model client.
"""

from __future__ import annotations

import argparse
import sys

from myagent import __version__


def main() -> None:
    """Entry point for the ``myagent`` console script."""
    parser = argparse.ArgumentParser(
        prog="myagent",
        description="A local autonomous coding agent powered by Ollama.",
    )
    parser.add_argument("--version", action="version", version=f"myagent {__version__}")
    parser.add_argument("--model", type=str, help="Ollama model tag to use")
    parser.add_argument("--host", type=str, help="Ollama API base URL")
    parser.add_argument("--num-ctx", type=int, help="Context window size in tokens")
    parser.add_argument("--temperature", type=float, help="Sampling temperature")
    parser.add_argument("--max-steps", type=int, help="Max tool-call iterations")
    parser.add_argument("--yolo", action="store_true", help="Auto-approve all actions (unsafe!)")
    parser.add_argument("--debug", action="store_true", help="Print debug logs")
    parser.add_argument("--headless", action="store_true", help="Run without interactive UI")
    parser.add_argument("--yes", action="store_true", help="Auto-approve all prompts (headless)")
    parser.add_argument("--task", type=str, help="Task to run in headless mode")
    parser.add_argument("--resume", type=str, help="Resume a previous session by ID")

    args = parser.parse_args()

    # For now, just print a placeholder message
    print(f"myagent v{__version__} — local autonomous coding agent")
    print("Full interactive mode coming in Milestone 7.")
    print(f"Working directory: {__import__('pathlib').Path.cwd()}")

    if args.task:
        print(f"Task: {args.task}")
        print("Headless mode not yet implemented.")
        sys.exit(0)


if __name__ == "__main__":
    main()
