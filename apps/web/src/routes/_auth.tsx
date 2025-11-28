import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

export const Route = createFileRoute('/_auth')({
  validateSearch: zodValidator(
    z.object({
      redirect: z
        .string()
        .default('/')
        .transform((v) => decodeURIComponent(v))
    })
  ),
  beforeLoad: async ({ context, search }) => {
    if (context.user) {
      // User already logged in.
      throw redirect({
        to: search.redirect,
        replace: true
      });
    }
  }
});
