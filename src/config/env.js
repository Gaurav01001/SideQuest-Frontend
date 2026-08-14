// ─── Environment Variables ────────────────────────────────────────────────────
// Single source of truth for all env vars and feature flags.
// Every other file should import from here — never from import.meta.env directly.

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL;

// ─── Feature Flags ────────────────────────────────────────────────────────────
export const FEATURES = {
  enableNotifications: true,
  enableModeration: true,
  enableRoles: true,
};

// ─── App Config ───────────────────────────────────────────────────────────────
export const APP_NAME = 'Link Up';
export const APP_VERSION = '0.1.0';
