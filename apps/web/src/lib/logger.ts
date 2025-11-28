import { useEnvironment } from './environment';
import pino from 'pino';

export function useLogger() {
  const { serverEnv, clientEnv } = useEnvironment();

  const logger = pino({
    level: serverEnv?.LOG_LEVEL ?? clientEnv?.VITE_LOG_LEVEL ?? 'info'
  });

  return {
    logger
  };
}
