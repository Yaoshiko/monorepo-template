import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { authClient, invalidateAuthCache } from 'src/lib/auth/client';
import { Button } from 'src/components/ui/button';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAppForm } from 'src/components/form';

export const Route = createFileRoute('/_auth/signup')({
  component: SignUp
});

function SignUp() {
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validators: {
      onChange: z
        .object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email(),
          password: z.string().min(8),
          confirmPassword: z.string()
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword']
        })
    },
    onSubmit: async ({ value }) => {
      const res = await authClient.signUp.email({
        name: `${value.firstName} ${value.lastName}`,
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password
      });
      if (res.data) {
        await invalidateAuthCache(router, queryClient);
        toast.info('Please check your email');
      } else {
        toast.error(res.error?.message ?? 'Sign up failed');
      }
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center overflow-y-auto py-20">
      <form.AppForm>
        <form.FormWrapper
          label="Sign up your account"
          description="Enter your email below for free donuts"
          className="mx-12 w-full sm:mx-0 sm:w-1/3 lg:w-1/5"
          onSubmit={form.handleSubmit}
        >
          <form.AppField name="firstName">
            {(field) => (
              <field.TextField label="First name" placeholder="Rick" />
            )}
          </form.AppField>
          <form.AppField name="lastName">
            {(field) => (
              <field.TextField label="Last name" placeholder="Astley" />
            )}
          </form.AppField>
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                type="email"
                placeholder="mr.bean@donuts.com"
              />
            )}
          </form.AppField>
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
          <form.SubmitButton label="Sign up" />
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background relative z-10 px-2">
              Or sign up with
            </span>
          </div>
          <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Signup with GitHub
          </Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </form.FormWrapper>
      </form.AppForm>
    </div>
  );
}
