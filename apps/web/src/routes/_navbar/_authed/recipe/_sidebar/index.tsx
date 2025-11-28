import { Button } from 'src/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/_navbar/_authed/recipe/_sidebar/')({
  component: RecipeSelectionComponent
});

function RecipeSelectionComponent() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-2">
        <h1>Are you hungry already?</h1>
        <Button asChild>
          <Link to="/recipe/new" activeProps={{ className: 'font-bold' }}>
            Create a new recipe
          </Link>
        </Button>
      </div>
      <img
        className="w-full md:w-1/2"
        src="/recipe-selection.svg"
        alt="Recipe sketch"
      />
    </div>
  );
}
