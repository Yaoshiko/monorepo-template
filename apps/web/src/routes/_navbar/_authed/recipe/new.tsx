import { createRecipe } from 'src/api/recipes';
import { useAppForm } from 'src/components/form';
import { useLogger } from 'src/lib/logger';
import { recipeSchema } from 'src/lib/validators/recipe';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

const { logger } = useLogger();

export const Route = createFileRoute('/_navbar/_authed/recipe/new')({
  component: RouteComponent
});

function RouteComponent() {
  const router = useRouter();
  const navigate = Route.useNavigate();
  const form = useAppForm({
    defaultValues: {
      title: '',
      content: ''
    },
    validators: {
      onChange: recipeSchema
    },
    onSubmit: async ({ value }) => {
      const recipe = await createRecipe({ data: value });
      if (recipe) {
        logger.info('Recipe created', recipe);
        router.invalidate();
        navigate({
          to: '/recipe/$recipeId',
          params: { recipeId: recipe.id }
        });
      } else {
        toast.error('Failed to create recipe');
      }
    }
  });

  return (
    <div className="m-12 flex flex-col items-center">
      <form.AppForm>
        <form.FormWrapper
          label="Create a new recipe"
          className="mx-12 w-full sm:mx-0 sm:w-1/3 lg:w-1/5"
          onSubmit={form.handleSubmit}
        >
          <form.AppField name="title">
            {(field) => (
              <field.TextField
                label="Title"
                placeholder="Spaghetti alla carbonara"
              />
            )}
          </form.AppField>
          <form.AppField name="content">
            {(field) => (
              <field.TextAreaField
                label="Procedure"
                placeholder="Please don't put the cream on it."
              />
            )}
          </form.AppField>
          <form.SubmitButton label="Create" />
        </form.FormWrapper>
      </form.AppForm>
    </div>
  );
}
