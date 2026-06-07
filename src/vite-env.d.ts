/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCAL_LIVE?: string;
  readonly VITE_FB_API_KEY?: string;
  readonly VITE_FB_AUTH_DOMAIN?: string;
  readonly VITE_FB_DATABASE_URL?: string;
  readonly VITE_FB_PROJECT_ID?: string;
  readonly VITE_FB_STORAGE_BUCKET?: string;
  readonly VITE_FB_MESSAGING_SENDER_ID?: string;
  readonly VITE_FB_APP_ID?: string;
  readonly VITE_OPENROUTER_KEY?: string;
  readonly VITE_OPENROUTER_MODEL?: string;
  readonly VITE_SESSION_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
