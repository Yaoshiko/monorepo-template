export interface LlmConnector {
  sendPrompt(prompt: string): Promise<string>;

  hasReachedLimit(): boolean;
}
