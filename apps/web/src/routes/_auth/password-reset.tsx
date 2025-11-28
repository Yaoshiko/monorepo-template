import { createFileRoute } from '@tanstack/react-router';
import { authClient } from 'src/lib/auth/client';
import { z } from 'zod';
import { toast } from 'sonner';
import { useLogger } from 'src/lib/logger';
import { useAppForm } from 'src/components/form';

const { logger } = useLogger();

export const Route = createFileRoute('/_auth/password-reset')({
  validateSearch: z.object({
    token: z.string()
  }),
  component: PasswordReset
});

function PasswordReset() {
  const { token } = Route.useSearch();
  const navigate = Route.useNavigate();
  const form = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    validators: {
      onChange: z
        .object({
          password: z.string().min(8),
          confirmPassword: z.string()
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword']
        })
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.resetPassword({
        token: token,
        newPassword: value.password
      });
      if (res.data) {
        logger.info('Updating password');
        toast.info('Password updated');
        navigate({
          to: '/'
        });
      } else {
        toast.error(res.error?.message ?? 'Could not send reset password');
      }
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center overflow-y-auto py-20">
      <form.AppForm>
        <form.FormWrapper
          label="Reset password"
          description="Enter your new password"
          className="mx-12 w-full sm:mx-0 sm:w-1/3 lg:w-1/5"
          onSubmit={form.handleSubmit}
        >
          <form.AppField name="password">
            {(field) => (
              <field.TextField
                label="Password"
                type="password"
                placeholder="******"
              />
            )}
          </form.AppField>
          <form.AppField name="confirmPassword">
            {(field) => (
              <field.TextField
                label="Confirm password"
                type="password"
                placeholder="******"
              />
            )}
          </form.AppField>
          <form.SubmitButton label="Reset password" />
        </form.FormWrapper>
      </form.AppForm>
    </div>
  );
}
