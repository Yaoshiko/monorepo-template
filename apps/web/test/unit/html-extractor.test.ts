import { describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import { extractPageFromContent } from '@/services/recipe-importer/html-extractor';

describe('Extract Page content from HTML', () => {
  it('should extract HTML content correctly', async () => {
    const expected = JSON.parse(
      await fs.readFile(
        new URL(
          '../fixtures/html-extractor/giallozafferano-carbonara-expected.json',
          import.meta.url
        ),
        'utf-8'
      )
    );
    const html = await fs.readFile(
      new URL(
        '../fixtures/html-extractor/giallozafferano-carbonara.html',
        import.meta.url
      ),
      'utf-8'
    );
    const pageContent = await extractPageFromContent(
      'https://ricette.giallozafferano.it/Spaghetti-alla-Carbonara.html',
      html
    );
    expect(pageContent).toEqual(expected);
  });
});
