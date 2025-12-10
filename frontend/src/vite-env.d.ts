/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ADMIN_CONFIRM_EMAIL: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_MAP_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
