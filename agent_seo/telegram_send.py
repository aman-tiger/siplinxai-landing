#!/usr/bin/env python3
"""Send article draft preview to Telegram with 3 inline buttons.

Buttons:
  ✅ Опубликовать  → callback_data: publish_{slug}
  ✏️ Исправить     → callback_data: fix_{slug}
  ❌ Отменить      → callback_data: cancel_{slug}

Reads credentials from agent_seo/.env
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path


def load_env():
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())


def get_credentials():
    load_env()
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    thread_id = os.environ.get("TELEGRAM_THREAD_ID")
    if not token or not chat_id:
        print("ERROR: Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in agent_seo/.env", file=sys.stderr)
        sys.exit(1)
    return token, chat_id, thread_id


def api_call(token: str, method: str, payload: dict) -> dict:
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"Telegram API error {e.code}: {body}", file=sys.stderr)
        sys.exit(1)


def send_preview(slug: str, title: str, excerpt: str, keyword: str, word_count: int) -> int:
    """Send article preview with 3 inline buttons. Returns message_id."""
    token, chat_id, thread_id = get_credentials()

    text = (
        f"<b>New article draft ready</b>\n\n"
        f"<b>Title:</b> {title}\n"
        f"<b>Keyword:</b> {keyword}\n"
        f"<b>Words:</b> {word_count}\n"
        f"<b>Slug:</b> <code>{slug}</code>\n\n"
        f"<b>Excerpt:</b>\n<i>{excerpt[:200]}</i>\n\n"
        f"<b>Draft:</b> <code>agent_seo/drafts/{slug}.md</code>"
    )

    keyboard = {
        "inline_keyboard": [[
            {"text": "✅ Опубликовать", "callback_data": f"publish_{slug}"},
            {"text": "✏️ Исправить",    "callback_data": f"fix_{slug}"},
            {"text": "❌ Отменить",     "callback_data": f"cancel_{slug}"},
        ]]
    }

    payload: dict = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
        "reply_markup": keyboard,
    }
    if thread_id:
        payload["message_thread_id"] = int(thread_id)

    result = api_call(token, "sendMessage", payload)
    msg_id = result["result"]["message_id"]
    print(f"Sent to Telegram (message_id={msg_id})")
    return msg_id


if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Usage: telegram_send.py <slug> <title> <excerpt> <keyword> <word_count>")
        sys.exit(1)

    send_preview(
        slug=sys.argv[1],
        title=sys.argv[2],
        excerpt=sys.argv[3],
        keyword=sys.argv[4],
        word_count=int(sys.argv[5]),
    )
