"""Allow running as ``python -m myagent``."""

import sys


def _main() -> None:
    """Minimal entry point — delegates to the CLI module."""
    # Lazy import so `python -m myagent --help` stays fast
    from myagent.ui.cli import main

    main()


if __name__ == "__main__":
    _main()
