# Claude Code Configuration

## 🔴 ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА — ЧИТАТЬ ПЕРЕД КАЖДЫМ ДЕЙСТВИЕМ

### 1. Всегда работать в ветке `main`
Никаких feature-веток. Только `main`.

### 2. После КАЖДОГО изменения — коммит + пуш + деплой

```bash
git add <файлы>
git commit -m "описание на русском"
git pull --rebase origin main
git push -u origin main
```

Затем сразу деплой через GitHub MCP:
```
mcp__github__actions_run_trigger(
  method="run_workflow",
  owner="aman-tiger",
  repo="siplinxai-landing",
  workflow_id="actions.yaml",
  ref="main"
)
```

Дождаться завершения и проверить через curl:
```bash
curl -s https://siplinx.com/<страница>/ | grep "маркер"
```

### 3. Сайт двуязычный — EN + RU

Любое изменение делать на **двух языках**:
- Английская версия: `src/pages/*.astro`
- Русская версия: `src/pages/ru/*.astro`

Примеры:
- `/authors/` → нужно и `/ru/authors/`
- `/authors/[slug]` → нужно и `/ru/authors/[slug]`
- `/help` → нужно и `/ru/help`

**Никогда не делать только одну языковую версию.**

### 4. Проверка деплоя

После деплоя проверять обе версии:
```bash
curl -s https://siplinx.com/страница/ | grep "маркер"
curl -s https://siplinx.com/ru/страница/ | grep "маркер"
```

---

See [AGENTS.md](./AGENTS.md) for full project documentation.
