/**
 * Global Application Configuration
 * Centralized share URLs, endpoints, and environment variables.
 */

// Default landing/share URL for the Gita application
export const APP_SHARE_URL: string =
  import.meta.env?.VITE_APP_SHARE_URL || 'https://dhnshydv.github.io/Gita';
