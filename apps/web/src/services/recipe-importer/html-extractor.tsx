import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import * as cheerio from 'cheerio';

export type PageContent = {
  url: string;
  title?: string;
  jsonLd: unknown[]; // schema.org etc.
  readableText?: string; // main content
  metaDescription?: string;
  canonicalUrl?: string;
};

export async function extractPageContent(url: string): Promise<PageContent> {
  const html = await fetchHtml(url);
  return extractPageFromContent(url, html);
}

export async function extractPageFromContent(
  url: string,
  html: string
): Promise<PageContent> {
  // 1) Fast parse for JSON-LD + metadata
  const $ = cheerio.load(html);
  const jsonLd: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).text().trim();
    if (!raw) return;
    try {
      jsonLd.push(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  });

  const title = $('title').text().trim() || undefined;
  const metaDescription = $('meta[name="description"]').attr('content')?.trim();
  const canonicalUrl = $('link[rel="canonical"]').attr('href')?.trim();

  // 2) Readability for main text (good fallback when JSON-LD is absent/partial)
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  const readableText = article?.textContent?.replace(/\s+/g, ' ').trim();

  return {
    url,
    title,
    jsonLd,
    readableText: readableText?.slice(0, 35_000), // keep bounded for prompts
    metaDescription,
    canonicalUrl
  };
}

async function fetchHtml(url: string, timeoutMs = 20_000): Promise<string> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'RecipeExtractor/1.0',
        accept: 'text/html,application/xhtml+xml'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}
