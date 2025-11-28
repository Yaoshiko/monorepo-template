import { createFileRoute } from '@tanstack/react-router';
import { authClient } from 'src/lib/auth/client';
import { z } from 'zod';
import { toast } from 'sonner';
import { useLogger } from 'src/lib/logger';
import { useAppForm } from 'src/components/form';

const { logger } = useLogger();

export const Route = createFileRoute('/_auth/password-forgot')({
  component: PasswordReset
});

function PasswordReset() {
  const navigate = Route.useNavigate();
  const form = useAppForm({
    defaultValues: {
      email: ''
    },
    validators: {
      onChange: z.object({
        email: z.string().email()
      })
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.forgetPassword({
        email: value.email,
        redirectTo: '/password-reset'
      });
      if (res.data) {
        logger.info('Password reset mail sent to');
        toast.info('Check your email');
        navigate({
          to: '/'
        });
      } else {
        toast.error(res.error?.message ?? 'Could not send password reset mail');
      }
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center overflow-y-auto py-20">
      <form.AppForm>
        <form.FormWrapper
          label="Reset password"
          description="You've been here multiple times, but probably can't remember"
          className="mx-12 w-full sm:mx-0 sm:w-1/3 lg:w-1/5"
          onSubmit={form.handleSubmit}
        >
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                type="email"
                placeholder="mr.bean@donuts.com"
              />
            )}
          </form.AppField>
          <form.SubmitButton label="Send reset email" />
        </form.FormWrapper>
      </form.AppForm>
    </div>
  );
}
