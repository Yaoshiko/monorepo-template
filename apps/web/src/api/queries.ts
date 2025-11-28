// Collection of react-query options.

import { queryOptions } from '@tanstack/react-query';
import { fetchRecipe } from './recipes';

export function fetchRecipeOpts(recipeId: string) {
  return queryOptions({
    staleTime: 30_000,
    queryKey: getRecipeQueryKey(recipeId),
    queryFn: () => fetchRecipe({ data: recipeId })
  });
}

export function getRecipeQueryKey(recipeId: string) {
  return ['recipeId', recipeId];
}
