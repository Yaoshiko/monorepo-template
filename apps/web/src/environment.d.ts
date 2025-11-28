// Define environment variables types.
declare global {
  namespace NodeJS {
    interface ProcessEnv extends CommonEnv {
      LOG_LEVEL: string;

      PUBLIC_BASEURL: string;
      // Better-auth.
      BETTER_AUTH_SECRET: string;
      /** Auth cookies duration in seconds. */
      BETTER_AUTH_COOKIE_CACHE: number;

      // Data layer.
      DB_HOST: string;
      DB_PORT: number;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      // Mail service.
      SMTP_SERVICE: string;
      SMTP_HOST: string;
      SMTP_PORT: number;
      SMTP_USER: string;
      SMTP_PASSWORD: string;

      // App-specific.
      // Emulated delay to explore TanStack SWR features.
      FETCH_RECIPES_DELAY: number;
      FETCH_RECIPE_DELAY: number;
    }
  }

  interface ImportMetaEnv extends CommonEnv {
    SSR: boolean;
    VITE_LOG_LEVEL: string;
  }

  interface ImportMeta {
    env: ImportMetaEnv;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
