import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { fetchRecipeOpts } from 'src/api/queries';
import { Trash2 } from 'lucide-react';
import { Button } from 'src/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter
} from 'src/components/ui/alert-dialog';
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog';
import { deleteRecipe } from 'src/api/recipes';
import { useLogger } from 'src/lib/logger';

const { logger } = useLogger();

export const Route = createFileRoute(
  '/_navbar/_authed/recipe/_sidebar/$recipeId'
)({
  loader: ({ context, params: { recipeId } }) => {
    logger.info('Loader recipe ', recipeId);
    context.queryClient.prefetchQuery(fetchRecipeOpts(recipeId));
  },
  component: RecipeComponent
});

// This is just a showcase of Deferred and useSuspenseQuery.
// FIXME: To improve this.
function RecipeComponent() {
  return (
    <div className="space-y-2">
      <Suspense fallback={<div>Loading...</div>}>
        <Deferred />
      </Suspense>
    </div>
  );
}

function Deferred() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const { recipeId } = Route.useParams();
  const { queryClient } = Route.useRouteContext();
  const recipe = useSuspenseQuery(fetchRecipeOpts(recipeId));

  const onDelete = async () => {
    logger.info('Query client', queryClient);
    try {
      await deleteRecipe({ data: recipeId });
      navigate({ to: '/recipe' });
      router.invalidate();
    } catch (error) {
      logger.warn('Failed to delete recipe', error);
      toast.error('Failed to delete recipe');
    }
  };

  return (
    <div className="flex">
      <div className="flex grow flex-col gap-4">
        <h4 className="text-xl font-bold">{recipe.data.title}</h4>
        <div className="text-sm whitespace-pre-line">{recipe.data.content}</div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="lg"
            className="fixed right-5 bottom-5 z-40 items-center gap-1 sm:static"
          >
            <span className="hidden sm:block">Delete</span>
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>
            Do you want to delete this recipe?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The recipe will be deleted permanently.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
