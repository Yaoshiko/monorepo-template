import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_navbar/_authed')({
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      });
    }

    return context;
  }
});
