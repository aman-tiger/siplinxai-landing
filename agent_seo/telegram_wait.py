#!/usr/bin/env python3
"""Poll Telegram for a button callback for the given article slug.

Usage:
  python3 agent_seo/telegram_wait.py <slug> [timeout_minutes]

Outputs to stdout (one line):
  publish   → user clicked "Опубликовать"
  fix       → user clicked "Исправить"
  cancel    → user clicked "Отменить"
  timeout   → no response within timeout_minutes (default 15)

Exit codes:
  0 → got a response (check stdout for action)
  1 → timeout or error
"""

import os
import sys
import json
import time
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


def get_updates(token: str, offset: int) -> list:
    url = (
        f"https://api.telegram.org/bot{token}/getUpdates"
        f"?offset={offset}&timeout=10&allowed_updates=callback_query"
    )
    try:
        with urllib.request.urlopen(url, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("result", [])
    except Exception:
        return []


def answer_callback(token: str, callback_id: str, text: str):
    url = f"https://api.telegram.org/bot{token}/answerCallbackQuery"
    payload = json.dumps({"callback_query_id": callback_id, "text": text}).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=10)
    except Exception:
        pass


def edit_message_reply_markup(token: str, chat_id: str, message_id: int, action: str):
    """Remove buttons and show result after user clicks."""
    labels = {"publish": "✅ Опубликован", "fix": "✏️ Отправлен на исправление", "cancel": "❌ Отменён"}
    text = labels.get(action, action)
    url = f"https://api.telegram.org/bot{token}/editMessageReplyMarkup"
    payload = json.dumps({
        "chat_id": chat_id,
        "message_id": message_id,
        "reply_markup": {"inline_keyboard": [[{"text": text, "callback_data": "done"}]]}
    }).encode()
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req, timeout=10)
    except Exception:
        pass


def main():
    load_env()

    if len(sys.argv) < 2:
        print("Usage: telegram_wait.py <slug> [timeout_minutes]", file=sys.stderr)
        sys.exit(1)

    slug = sys.argv[1]
    timeout_minutes = int(sys.argv[2]) if len(sys.argv) > 2 else 15

    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        print("ERROR: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID required", file=sys.stderr)
        sys.exit(1)

    deadline = time.time() + timeout_minutes * 60
    offset = 0

    print(f"Waiting for Telegram response for '{slug}' (timeout: {timeout_minutes} min)...", file=sys.stderr)

    while time.time() < deadline:
        updates = get_updates(token, offset)

        for update in updates:
            offset = update["update_id"] + 1

            if "callback_query" not in update:
                continue

            cb = update["callback_query"]
            data = cb.get("data", "")
            cb_id = cb["id"]
            msg = cb.get("message", {})
            msg_id = msg.get("message_id")

            # Check if this callback is for our slug
            if data == f"publish_{slug}":
                answer_callback(token, cb_id, "Запускаю публикацию...")
                if msg_id:
                    edit_message_reply_markup(token, chat_id, msg_id, "publish")
                print("publish")
                sys.exit(0)

            elif data == f"fix_{slug}":
                answer_callback(token, cb_id, "Отмечено для исправления")
                if msg_id:
                    edit_message_reply_markup(token, chat_id, msg_id, "fix")
                print("fix")
                sys.exit(0)

            elif data == f"cancel_{slug}":
                answer_callback(token, cb_id, "Драфт отменён")
                if msg_id:
                    edit_message_reply_markup(token, chat_id, msg_id, "cancel")
                print("cancel")
                sys.exit(0)

        time.sleep(5)

    print("timeout", file=sys.stdout)
    sys.exit(1)


if __name__ == "__main__":
    main()
