#!/usr/bin/env python3
"""Send a message to the Siplinx AI Telegram channel for content approval.

Requires environment variables (set in agent_seo/.env):
  TELEGRAM_BOT_TOKEN  — bot token from @BotFather
  TELEGRAM_CHAT_ID    — group chat ID (negative number for supergroups)
  TELEGRAM_THREAD_ID  — topic/thread ID within the group
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path


def load_env():
    """Load .env file from agent_seo/ directory if present."""
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())


def send(text: str) -> dict:
    load_env()

    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    thread_id = os.environ.get("TELEGRAM_THREAD_ID")

    if not token or not chat_id:
        print("ERROR: Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in agent_seo/.env", file=sys.stderr)
        sys.exit(1)

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload: dict = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    if thread_id:
        payload["message_thread_id"] = int(thread_id)

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            print("Sent to Telegram OK")
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"Telegram error {e.code}: {body}", file=sys.stderr)
        sys.exit(1)


def format_preview(slug: str, title: str, excerpt: str, keyword: str, word_count: int, draft_path: str) -> str:
    return (
        f"<b>New article draft ready for review</b>\n\n"
        f"<b>Title:</b> {title}\n"
        f"<b>Keyword:</b> {keyword}\n"
        f"<b>Words:</b> {word_count}\n"
        f"<b>Slug:</b> <code>{slug}</code>\n\n"
        f"<b>Excerpt:</b>\n{excerpt}\n\n"
        f"<b>Draft file:</b> <code>{draft_path}</code>\n\n"
        f"Reply <b>да</b> to publish.\n"
        f"Then run in Claude Code:\n"
        f"<code>/agent seo-approve {slug}</code>"
    )


if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Usage: telegram_send.py <slug> <title> <excerpt> <keyword> <word_count> [draft_path]")
        sys.exit(1)

    slug = sys.argv[1]
    title = sys.argv[2]
    excerpt = sys.argv[3]
    keyword = sys.argv[4]
    word_count = int(sys.argv[5])
    draft_path = sys.argv[6] if len(sys.argv) > 6 else f"agent_seo/drafts/{slug}.md"

    message = format_preview(slug, title, excerpt, keyword, word_count, draft_path)
    send(message)
