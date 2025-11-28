import { setResponseStatus } from '@tanstack/react-start/server';
import { db } from '.';
import { eq } from 'drizzle-orm';
import { appSchema } from 'drizzle-db';

export async function insertRecipe(
  userId: string,
  recipeInsert: Omit<appSchema.RecipeInsert, 'userId'>
) {
  return (
    await db
      .insert(appSchema.recipes)
      .values({ userId, ...recipeInsert })
      .returning()
  )[0];
}

export async function deleteRecipeById(userId: string, recipeId: string) {
  const recipe = (
    await db
      .select()
      .from(appSchema.recipes)
      .where(eq(appSchema.recipes.id, recipeId))
  )[0];
  if (!recipe) {
    setResponseStatus(404);
    throw new Error('Recipe not found');
  }
  if (recipe.userId != userId) {
    setResponseStatus(401);
    throw new Error('Unauthorized');
  }
  await db.delete(appSchema.recipes).where(eq(appSchema.recipes.id, recipeId));
}
