export function useEnvironment() {
  const isServer = import.meta.env.SSR;

  return {
    serverEnv: isServer ? process.env : undefined,
    clientEnv: !isServer ? import.meta.env : undefined
  };
}
