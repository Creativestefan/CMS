// Server-side logger utility that only logs in development environment
const isProduction = Deno.env.get('DENO_DEPLOYMENT_ID') !== undefined;

export const logger = {
  log: (...args: any[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors, even in production (for debugging critical issues)
    console.error(...args);
  },
  warn: (...args: any[]) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
};
