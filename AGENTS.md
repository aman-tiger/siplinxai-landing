# Siplinx AI — Инструкции для AI-агента

---

## 🔴 ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА (выполнять ВСЕГДА)

### 0. Всегда работать ТОЛЬКО в ветке `main`

- Никаких feature-веток. Все изменения — прямо в `main`.
- Не создавать лишних веток. Работаем в `main`, коммитим в `main`, пушим в `main`.

### 1. После каждого изменения — коммит и пуш

```
git add <файлы>
git commit -m "описание на русском"
git push -u origin main
```

**Никогда не оставлять изменения без коммита.** Если хук жалуется на незакоммиченные файлы — сразу коммитить и пушить.

### 2. Деплой на Cloudflare Pages — ОБЯЗАТЕЛЬНО после каждого пуша

⚠️ **ВАЖНО: push в `main` САМ ПО СЕБЕ деплой НЕ запускает.** Нужно вручную дёрнуть `workflow_dispatch` — иначе на проде останется старая версия.

**Проверенная последовательность деплоя (выполнять ВСЕГДА после пуша):**

**Шаг 1 — запустить деплой через GitHub MCP:**

```
mcp__github__actions_run_trigger(method="run_workflow", owner="aman-tiger", repo="siplinxai-landing", workflow_id="actions.yaml", ref="main")
```

Этот workflow (`actions.yaml`, джоб `deploy`) делает: `npm run build` → `wrangler pages deploy dist --project-name=siplinxai-landing --branch=main` на Cloudflare Pages.

**Шаг 2 — дождаться раскатки и проверить прод** (билд ~1-2 мин + раскатка Cloudflare ~1 мин). Проверять напрямую на живом сайте через `curl` (браузер к siplinx.com через прокси не ходит — `ERR_CONNECTION_CLOSED`):

```
curl -s https://siplinx.com/<страница>/ | grep -oc '<маркер изменения>'
```

**Шаг 3 — перед деплоем убедиться, что билд проходит локально:**

```
npm run build   # должен дать exit 0 и "Complete!"
```

Если `npm run build` падает — Cloudflare тоже не задеплоит. Сначала чиним билд.

### 3. Язык

Все планы, комментарии, описания коммитов — **на русском языке**.

### 4. SE Ranking MCP — правила работы с ключевыми словами

- Семена (seeds): **1–2 слова максимум** для максимального охвата
- На каждый сид — вызов: `getRelatedKeywords` + `getSimilarKeywords` + `getLongTailKeywords` + `getKeywordQuestions`
- Фильтр для своего сайта: KD 0–40, Volume 50+, Intent C или T
- Фильтр для внешних: KD 41–75, Volume 200+
- Фильтр для AEO: KD 0–85, Volume 1000+
- Если по сиду < 20 результатов → берём следующий сид, **не зацикливаемся**
- Максимум 3 попытки на один сид — затем идём дальше
- Результаты пишем в CSV: `seo/` папка, формат как в примерах

### 5. Структура CSV файлов (seo/)

Колонки: `keyword, priority, volume, kd, cpc, intent, seed, flag, published, Ссылка конкурента 1, Ссылка конкурента 2, Ссылка конкурента 3, Заголовок конкурента 1, Заголовок конкурента 2, Заголовок конкурента 3, Сниппет конкурента 1, Сниппет конкурента 2, Сниппет конкурента 3`

- `flag`: `ok` (релевантно) или `irrelevant` (нерелевантно)
- `published`: пусто пока статья не написана; потом ставим URL

---

## О проекте

**Siplinx AI** — десктопное приложение для записи и транскрипции встреч с локальным ИИ.

- Конкуренты: Granola, Fireflies.ai, Otter.ai, Fathom, tl;dv
- Локальный LLM + STT на устройстве пользователя (без облака)
- Mac + Windows
- 14 дней бесплатно по промокоду QATEST100
- Цена после триала: $9/месяц

**Стек:** Astro v6 | Tailwind CSS v4 | TypeScript 5.9 | MDX | Sharp

**Stack:** Astro v6 | Tailwind CSS v4 | TypeScript 5.9 | MDX | Sharp

## Quick Reference

| Command           | Purpose                             |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Production build to `./dist/`       |
| `npm run preview` | Preview production build locally    |
| `npm run check`   | Run astro check + ESLint + Prettier |
| `npm run fix`     | Auto-fix ESLint + Prettier issues   |

**Node.js requirement:** >= 22.12.0

## Architecture

### Directory Structure

```
src/
  assets/styles/tailwind.css   # Tailwind v4 config (themes, utilities, plugins)
  components/
    common/        # Shared: Image, Metadata, Analytics, ToggleTheme
    ui/            # Primitives: Button, Headline, WidgetWrapper, ItemGrid
    widgets/       # Page sections: Hero, Features, Pricing, Header, Footer
    blog/          # Blog: SinglePost, List, Pagination, Tags
    CustomStyles.astro  # CSS variables for colors and fonts
  content.config.ts    # Content Collections schema (Astro v6 location)
  data/post/           # Blog posts (.md, .mdx)
  layouts/             # Layout.astro, PageLayout.astro, MarkdownLayout.astro
  pages/               # File-based routing
  utils/               # blog.ts, images.ts, permalinks.ts, frontmatter.ts
  config.yaml          # Site configuration (loaded as virtual module)
  navigation.ts        # Navigation structure
  types.d.ts           # TypeScript type definitions
vendor/integration/    # Custom Astro integration for config loading
```

### Path Aliases

Use `~/` to import from `src/`:

```typescript
import Image from '~/components/common/Image.astro';
import { SITE } from 'astrowind:config';
```

### Configuration System

Site config lives in `src/config.yaml` and is loaded as a Vite virtual module `astrowind:config` by the custom integration in `vendor/integration/`. Exports: `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS`.

## Tailwind CSS v4

Configuration is CSS-first in `src/assets/styles/tailwind.css`:

- **Theme tokens:** `@theme { --color-primary: var(--aw-color-primary); ... }`
- **Custom utilities:** `@utility bg-page { ... }`
- **Dark mode:** Class-based via `@variant dark (&:where(.dark, .dark *))`
- **Plugins:** `@plugin "@tailwindcss/typography"`
- **Custom variant:** `@custom-variant intersect (&:not([no-intersect]))`

CSS variables for colors/fonts are defined in `src/components/CustomStyles.astro` with light/dark theme variants.

The Vite plugin `@tailwindcss/vite` is configured in `astro.config.ts` (not as an Astro integration).

### Class Merging

Components use `twMerge` from `tailwind-merge` v3 for conditional class composition.

## Content Collections

Defined in `src/content.config.ts` using the Astro v6 Content Layer API with `glob()` loader. Posts are in `src/data/post/` as `.md` or `.mdx` files.

Post frontmatter: `title` (required), `publishDate`, `updateDate`, `draft`, `excerpt`, `image`, `category`, `tags`, `author`, `metadata`.

## Component Patterns

- Props extend interfaces from `~/types`
- Use `class:list` for conditional classes
- Use `twMerge()` when accepting className overrides
- Use named slots for layout composition
- Widget components accept standardized props (see `~/types`)

## Image Handling

`src/components/common/Image.astro` supports:

- Local images via `astro:assets` (optimized by Sharp)
- Remote images via Unpic CDN
- Allowed domains (for providers Unpic can't detect, processed by Sharp): `cdn.pixabay.com`

Hero images use `loading="eager"` and `fetchpriority="high"`.

## Verification Checklist

After changes, always verify:

1. `npm run build` succeeds
2. `npm run check` passes (astro check + ESLint + Prettier)
3. Visual check in browser: homepage, blog, dark mode, mobile menu
