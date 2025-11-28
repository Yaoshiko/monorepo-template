import { and, eq } from 'drizzle-orm';
import { appSchema } from 'drizzle-db';
import { db } from '.';

export function getRecipeTitles(userId: string) {
  return db
    .select({ id: appSchema.recipes.id, title: appSchema.recipes.title })
    .from(appSchema.recipes)
    .where(eq(appSchema.recipes.userId, userId))
    .orderBy(appSchema.recipes.createdAt);
}

export async function getRecipe(userId: string, recipeId: string) {
  return (
    await db
      .select()
      .from(appSchema.recipes)
      .where(
        and(
          eq(appSchema.recipes.userId, userId),
          eq(appSchema.recipes.id, recipeId)
        )
      )
  )[0]!;
}
