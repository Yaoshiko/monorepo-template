import { z } from 'zod';

export const recipeSchema = z.object({
  title: z.string(),
  content: z.string()
});
