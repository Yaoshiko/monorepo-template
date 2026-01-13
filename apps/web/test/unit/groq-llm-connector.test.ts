import { describe, expect, it } from 'vitest';
import { GroqJsonClient } from '@/services/llm-connector/groq-llm-connector';
import fs from 'fs/promises';

describe('Extract Recipe with Groq', () => {
  it('should extract HTML content correctly', async () => {
    const pageContent = await fs.readFile(
      new URL(
        '../fixtures/html-extractor/giallozafferano-carbonara-expected.json',
        import.meta.url
      ),
      'utf-8'
    );

    const client = new GroqJsonClient();
    const res = await client.prompt<{
      title: string;
      ingredients: string[];
      instructions: string[];
      prepTime: string;
      cookTime: string;
      totalTime: string;
      servings: string;
      notes: string;
    }>({
      messages: [
        {
          role: 'system',
          content:
            `
            You are a helpful assistant that extracts recipe information from HTML content and returns it in JSON format.
            The JSON object MUST have the following structure (please be exact with field names and types):
            {
              "title": string,
              "ingredients": [
                {
                    "name": string,
                    "quantity": number,
                    "unit": string # grams, tablespoons, egg sizing, etc.
                }
              ],
              "nutrition": {
                "calories": number, # in kcal, 0 if unknown
                "fat": number, # in grams, 0 if unknown
                "carbohydrates": number, # in grams, 0 if unknown
                "protein": number # in grams, 0 if unknown
              },
              "procedure": string[],
              "prepTime": string,
              "cookTime": string,
              "totalTime": string,
              "servings": string,
              "notes": string
            }
            Ensure the JSON is properly formatted.

            Here is the HTML content:
            ` + pageContent
        }
      ]
    });
    console.log('Extracted Recipe:', res);
  });
});
