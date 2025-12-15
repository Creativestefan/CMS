// Logger utility that only logs in development environment (not on creativestefan.work)
const isProduction = typeof window !== 'undefined' && window.location.hostname === 'creativestefan.work';

// Allow logging in admin dashboard even in production for debugging
const isAdminPage = typeof window !== 'undefined' && window.location.search.includes('admin=true');

export const logger = {
  log: (...args: any[]) => {
    if (!isProduction || isAdminPage) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    // Always log errors
    console.error(...args);
  },
  warn: (...args: any[]) => {
    if (!isProduction || isAdminPage) {
      console.warn(...args);
    }
  },
};
