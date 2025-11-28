import { QueryClient, queryOptions } from '@tanstack/react-query';
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { RegisteredRouter } from '@tanstack/react-router';
import { useLogger } from '../logger';
import { useEnvironment } from '../environment';

const AUTH_QUERY_KEY = 'user';
const { logger } = useLogger();
const { serverEnv } = useEnvironment();

export const authClient = createAuthClient({
  baseURL: serverEnv?.PUBLIC_BASEURL,
  plugins: [
    inferAdditionalFields({
      user: {
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        }
      }
    })
  ]
});

export const fetchUserOpts = queryOptions({
  queryKey: [AUTH_QUERY_KEY],
  staleTime: 3 * 60 * 1000,
  queryFn: () => {
    logger.info('Re-fetching session');
    return authClient.getSession({
      query: {
        disableCookieCache: false,
        disableRefresh: true
      }
    });
  }
});

// TODO: Export better APIs (signIn, signOut, ...) to hide the cache implementation.
export async function invalidateAuthCache(
  router: RegisteredRouter,
  queryClient: QueryClient
) {
  logger.info('Invalidating auth cache');
  // Ensure cached data is invalidated.
  await queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
  router.invalidate();
}
