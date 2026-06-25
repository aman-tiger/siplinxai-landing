#!/usr/bin/env node
/**
 * Auto-generates /public/llms.txt from all published blog articles.
 * Run automatically on deploy via GitHub Actions.
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const POSTS_DIR = join(ROOT, 'src/data/post');
const OUTPUT = join(ROOT, 'public/llms.txt');

const CATEGORY_LABELS = {
  Comparisons: 'Blog: Comparisons and Alternatives',
  Integrations: 'Blog: Integrations',
  Guides: 'Blog: Guides and How-To',
  Privacy: 'Blog: Privacy and Security',
  Productivity: 'Blog: Productivity',
  Templates: 'Blog: Templates',
  Sales: 'Blog: Sales',
  Platform: 'Blog: Platform',
};

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) fm[key.trim()] = rest.join(':').trim().replace(/^['"]|['"]$/g, '');
  }
  return fm;
}

async function getArticles(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const articles = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const sub = await getArticles(join(dir, entry.name), entry.name + '/');
      articles.push(...sub);
      continue;
    }
    if (!entry.name.endsWith('.md')) continue;

    const slug = prefix + entry.name.replace(/\.md$/, '');
    const content = await readFile(join(dir, entry.name), 'utf-8');
    const fm = extractFrontmatter(content);

    if (!fm.title || fm.draft === 'true') continue;

    // Skip RU articles in main section (they go in Optional)
    const isRu = slug.startsWith('ru/');

    articles.push({
      slug,
      title: fm.title,
      excerpt: fm.excerpt || '',
      category: fm.category || 'Guides',
      isRu,
    });
  }

  return articles;
}

async function main() {
  const articles = await getArticles(POSTS_DIR);

  // Group EN articles by category
  const enArticles = articles.filter(a => !a.isRu);
  const ruArticles = articles.filter(a => a.isRu);

  const byCategory = {};
  for (const article of enArticles) {
    const cat = article.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(article);
  }

  // Sort categories by priority
  const categoryOrder = ['Comparisons', 'Integrations', 'Guides', 'Privacy', 'Productivity', 'Templates', 'Sales', 'Platform'];
  const sortedCategories = [
    ...categoryOrder.filter(c => byCategory[c]),
    ...Object.keys(byCategory).filter(c => !categoryOrder.includes(c)),
  ];

  let out = `# Siplinx AI

> Siplinx AI is a private, offline desktop app for AI-powered meeting notes. It transcribes, summarizes, and extracts action items from meetings, entirely on-device using a local LLM and local speech-to-text. No audio, transcripts, or data ever leave your device.

Siplinx AI works with Zoom, Google Meet, and Microsoft Teams. Unlike cloud-based competitors (Granola, Fireflies.ai, Otter.ai, Fathom, tl;dv), Siplinx AI processes everything locally, making it the choice for professionals who handle confidential conversations. Available for Mac and Windows, in English and Russian.

Key differentiators:
- 100% offline: works without internet after setup
- Local LLM + local STT (speech-to-text): no third-party AI APIs used
- No subscription data risk: your meeting content never touches external servers
- GDPR and HIPAA-friendly by design
- Supports multi-speaker diarization (identifies who said what)
- One-time purchase or subscription: no mandatory cloud account

## Product

- [Home](https://siplinx.com/): Overview of features, use cases, and value proposition of Siplinx AI
- [Download](https://siplinx.com/download/): Download the desktop app for Mac and Windows, free trial available
- [Pricing](https://siplinx.com/pricing/): Plans and pricing, one-time and subscription options
- [Security](https://siplinx.com/security/): Technical details on how all data stays on-device and never reaches external servers
- [About](https://siplinx.com/about/): Company background, mission, and team
- [Help](https://siplinx.com/help/): Support documentation, FAQ, and getting started guides
- [Contact](https://siplinx.com/contact/): Contact the Siplinx AI team

`;

  for (const cat of sortedCategories) {
    const label = CATEGORY_LABELS[cat] || `Blog: ${cat}`;
    out += `## ${label}\n\n`;
    for (const a of byCategory[cat]) {
      const url = `https://siplinx.com/${a.slug}/`;
      const desc = a.excerpt.replace(/[—–]/g, '-').slice(0, 120);
      out += `- [${a.title}](${url})${desc ? ': ' + desc : ''}\n`;
    }
    out += '\n';
  }

  out += `## Legal

- [Privacy Policy](https://siplinx.com/privacy/): How Siplinx AI handles (or rather, does not collect) user data
- [Terms of Service](https://siplinx.com/terms/): Terms of use for Siplinx AI

## Optional

- [Press](https://siplinx.com/press/): Press kit, media resources, and company facts
- [Careers](https://siplinx.com/careers/): Open positions at Siplinx AI
- [Authors](https://siplinx.com/authors/): Team members and advisors who write for Siplinx AI
- [Russian version: Home](https://siplinx.com/ru/): Main page in Russian
- [Russian version: Blog](https://siplinx.com/ru/blog/): Articles on AI, privacy, and meeting productivity in Russian
`;

  for (const a of ruArticles.slice(0, 6)) {
    const url = `https://siplinx.com/${a.slug}/`;
    out += `- [Russian: ${a.title}](${url}): Russian language version\n`;
  }

  await writeFile(OUTPUT, out, 'utf-8');
  console.log(`llms.txt generated: ${enArticles.length} EN articles, ${ruArticles.length} RU articles`);
}

main().catch(console.error);
