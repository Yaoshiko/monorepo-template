import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { fetchRecipeTitles } from 'src/api/recipes';
import { cn } from 'src/lib/utils';
import { Button } from 'src/components/ui/button';
import { Plus } from 'lucide-react';
import { useLogger } from 'src/lib/logger';

const { logger } = useLogger();

export const Route = createFileRoute('/_navbar/_authed/recipe/_sidebar')({
  staleTime: 30_000, // Prevent refetching all recipes at every route load.
  loader: async () => {
    logger.info('Loading all recipes...');
    return await fetchRecipeTitles();
  },
  component: RecipesComponent
});

function RecipesComponent() {
  const recipes = Route.useLoaderData();
  // FIXME: Find a better way to detect if route match is exact.
  //        `matches` argument in beforeLoad seems an option.
  const isDefault = Object.keys(Route.useMatch().params).length == 0;

  const noRecipes = recipes.length == 0;

  return (
    <div className="flex min-h-full">
      {
        // FIXME: To verify on mobile.
        !noRecipes ? (
          <div
            className={cn(
              'no-scrollbar border-right text-muted-foreground flex min-h-full min-w-40 grow-1 flex-col overflow-y-hidden border-r border-gray-200 sm:max-w-80',
              {
                'hidden sm:flex': !isDefault
              }
            )}
          >
            {recipes.map(({ id, title }) => (
              <Link
                key={id}
                className="hover:bg-muted hover:text-accent-foreground items-center px-4 py-2 whitespace-nowrap"
                to="/recipe/$recipeId"
                params={{
                  recipeId: id
                }}
                activeProps={{
                  className: 'text-accent-foreground font-bold bg-muted'
                }}
              >
                {title}
              </Link>
            ))}
            <Button className="fixed right-5 bottom-5 sm:hidden">
              <Link to="/recipe/new">
                <Plus />
              </Link>
            </Button>
          </div>
        ) : null
      }
      <div
        className={cn('grow-4 sm:flex', {
          hidden: !noRecipes && isDefault
        })}
      >
        <div className="m-12 grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
