import { useEnvironment } from '@/lib/environment';
import OpenAI from 'openai';

export type ChatRole = 'system' | 'user' | 'assistant';
export type ChatMessage = { role: ChatRole; content: string };

export type GroqClientOptions = {
  apiKey?: string;
  model?: string;
  baseURL?: string; // default Groq endpoint
  timeoutMs?: number; // request timeout
  maxRetries?: number; // retry on transient failures
};

/**
 * Groq provider using the OpenAI-compatible Chat Completions API.
 *
 * Env:
 *   GROQ_API_KEY=...
 *   GROQ_MODEL=llama-3.1-8b-instant   (or another Groq model)
 */
export class GroqJsonClient {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(opts: GroqClientOptions = {}) {
    const env = useEnvironment();
    const apiKey = opts.apiKey ?? env.serverEnv!.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Missing GROQ_API_KEY (or pass apiKey to GroqJsonClient).'
      );
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: opts.baseURL ?? 'https://api.groq.com/openai/v1'
    });

    this.model =
      opts.model ?? env.serverEnv!.GROQ_MODEL ?? 'llama-3.1-8b-instant';
    this.timeoutMs = opts.timeoutMs ?? 30_000;
    this.maxRetries = opts.maxRetries ?? 2;
  }

  /**
   * Calls Groq Chat Completions and returns a parsed JSON object.
   * Enforces "JSON only" via prompt + robust parsing of first JSON object in the response.
   */
  async prompt<T>(args: {
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<T> {
    const temperature = args.temperature ?? 0;
    const maxTokens = args.maxTokens ?? 1500;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'Return only a single valid JSON object. No markdown, no code fences, no commentary.'
      },
      ...args.messages
    ];

    let lastErr: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const resp = await this.client.chat.completions.create(
          {
            model: this.model,
            temperature,
            max_tokens: maxTokens,
            messages
          },
          { timeout: this.timeoutMs }
        );

        const text = resp.choices?.[0]?.message?.content ?? '';
        const jsonText = extractFirstJsonObject(text);
        return JSON.parse(jsonText) as T;
      } catch (err) {
        lastErr = err;
        if (!isRetryableError(err) || attempt === this.maxRetries) break;
        await sleep(backoffMs(attempt));
      }
    }

    throw wrapError(lastErr, 'Groq JSON completion failed');
  }
}

/** Extracts the first top-level JSON object found in a string. */
function extractFirstJsonObject(s: string): string {
  const start = s.indexOf('{');
  if (start < 0) throw new Error('Model did not return a JSON object.');

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < s.length; i++) {
    const ch = s[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    } else {
      if (ch === '"') {
        inString = true;
        continue;
      }
      if (ch === '{') depth++;
      if (ch === '}') depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }

  throw new Error('Unterminated JSON object in model response.');
}

function isRetryableError(err: unknown): boolean {
  // OpenAI SDK errors vary; treat common transient cases as retryable.
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('ETIMEDOUT') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ENOTFOUND') ||
    msg.includes('429') ||
    msg.includes('503') ||
    msg.includes('502') ||
    msg.includes('504') ||
    msg.toLowerCase().includes('timeout')
  );
}

function backoffMs(attempt: number): number {
  // 250ms, 500ms, 1000ms...
  return 250 * Math.pow(2, attempt);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function wrapError(err: unknown, prefix: string): Error {
  if (err instanceof Error)
    return new Error(`${prefix}: ${err.message}`, { cause: err });
  return new Error(`${prefix}: ${String(err)}`);
}
