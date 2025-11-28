import { createIsomorphicFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { auth } from '.';
import { QueryClient } from '@tanstack/react-query';
import { fetchUserOpts } from './client';
import { useLogger } from '../logger';

const { logger } = useLogger();

export const getUser = createIsomorphicFn()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .server(async (queryClient: QueryClient | undefined) => {
    logger.debug('Fetching logged-in user');
    const { headers } = getWebRequest()!;
    const session = await auth.api.getSession({
      headers,
      query: {
        disableCookieCache: false
      }
    });
    const user = session?.user;
    logger.info('Fetched logged-in user', user?.email);
    return user;
  })
  .client(async (queryClient: QueryClient | undefined) => {
    const session = await queryClient!.fetchQuery(fetchUserOpts);
    const user = session?.data?.user;
    logger.info('Session retrieved', user?.email);
    return user;
  });
