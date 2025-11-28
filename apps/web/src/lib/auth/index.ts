import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from 'src/db';
import { useEnvironment } from '../environment';
import { useAuthEmail } from '../mail';
import { authSchema } from 'drizzle-db';

const { serverEnv } = useEnvironment();
const { sendVerificationEmail, sendResetPassword } = useAuthEmail();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema
  }),
  trustedOrigins: [serverEnv!.PUBLIC_BASEURL],
  user: {
    additionalFields: {
      firstName: {
        type: 'string',
        required: true,
        input: true
      },
      lastName: {
        type: 'string',
        required: true,
        input: true
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) =>
      await sendResetPassword(user as authSchema.User, url)
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) =>
      await sendVerificationEmail(user as authSchema.User, url)
  },
  session: {
    freshAge: serverEnv!.BETTER_AUTH_COOKIE_CACHE,
    cookieCache: {
      enabled: true,
      maxAge: serverEnv!.BETTER_AUTH_COOKIE_CACHE
    }
  },
  cookieCache: {
    enabled: true,
    maxAge: serverEnv!.BETTER_AUTH_COOKIE_CACHE
  }
});
