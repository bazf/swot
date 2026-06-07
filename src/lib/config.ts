/* config.ts — resolve the runtime mode (demo / live / locked) + decrypted config. */

import type { Role } from '../state/types';
import { decryptJson, readKeyFromHash, readStoredKey } from './crypto';
import { ENCRYPTED_CONFIG } from './encrypted-config';
import { DEFAULT_SESSION_ID, readRole } from './session';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

export interface AppConfig {
  firebase: FirebaseClientConfig;
  openrouter: { key: string; model?: string };
  sessionId?: string;
}

/**
 * - `demo`   — no committed ciphertext: run the offline simulation (default).
 * - `live`   — config decrypted (via URL key or local env): connect to Firebase.
 * - `locked` — a ciphertext is committed but the URL key is missing/invalid.
 */
export type Mode = 'demo' | 'live' | 'locked';

export interface Resolution {
  mode: Mode;
  config: AppConfig | null;
  role: Role;
  sessionId: string;
  /** True when a key was present in the URL hash (→ scrub the hash). */
  fromHashKey: boolean;
  /** The password that unlocked the config (so the caller can remember it). */
  key?: string;
}

export interface ResolveInput {
  hash?: string;
  search?: string;
  encrypted?: string;
  env?: Partial<ImportMetaEnv>;
  /** Previously remembered key; defaults to localStorage. */
  storedKey?: string;
}

/** Local-only live mode for developers (VITE_LOCAL_LIVE=1 in .env.local). */
function readEnvConfig(env: Partial<ImportMetaEnv>): AppConfig | null {
  if (env.VITE_LOCAL_LIVE !== '1') return null;
  if (!env.VITE_FB_API_KEY || !env.VITE_FB_DATABASE_URL) return null;
  return {
    firebase: {
      apiKey: env.VITE_FB_API_KEY,
      authDomain: env.VITE_FB_AUTH_DOMAIN ?? '',
      databaseURL: env.VITE_FB_DATABASE_URL,
      projectId: env.VITE_FB_PROJECT_ID ?? '',
      storageBucket: env.VITE_FB_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FB_MESSAGING_SENDER_ID,
      appId: env.VITE_FB_APP_ID,
    },
    openrouter: { key: env.VITE_OPENROUTER_KEY ?? '', model: env.VITE_OPENROUTER_MODEL },
    sessionId: env.VITE_SESSION_ID,
  };
}

function isValidConfig(cfg: unknown): cfg is AppConfig {
  if (!cfg || typeof cfg !== 'object') return false;
  const fb = (cfg as AppConfig).firebase;
  return !!fb && typeof fb.databaseURL === 'string' && fb.databaseURL.length > 0;
}

export function resolveConfig(input: ResolveInput = {}): Resolution {
  const hasWindow = typeof window !== 'undefined';
  const hash = input.hash ?? (hasWindow ? window.location.hash : '');
  const search = input.search ?? (hasWindow ? window.location.search : '');
  const encrypted = input.encrypted ?? ENCRYPTED_CONFIG;
  const env = input.env ?? import.meta.env;
  const role = readRole(search, hash);

  // 0. Explicit demo override (public showcase / e2e) — always offline, no secrets,
  //    even when a production ciphertext is committed.
  const demoParam = new URLSearchParams(search).get('demo');
  if (demoParam === '1' || demoParam === 'true') {
    return { mode: 'demo', config: null, role, sessionId: DEFAULT_SESSION_ID, fromHashKey: false };
  }

  // 1. Local developer live mode (env-driven) — never scrubs the hash.
  const envCfg = readEnvConfig(env);
  if (envCfg) {
    return {
      mode: 'live',
      config: envCfg,
      role,
      sessionId: envCfg.sessionId || DEFAULT_SESSION_ID,
      fromHashKey: false,
    };
  }

  // 2. No committed ciphertext → offline demo.
  if (!encrypted || !encrypted.trim()) {
    return { mode: 'demo', config: null, role, sessionId: DEFAULT_SESSION_ID, fromHashKey: false };
  }

  // 3. Ciphertext present → unlock with the URL key, or a previously remembered one.
  //    A URL key wins (and overwrites the stored one); a stored key keeps a refresh unlocked.
  const urlKey = readKeyFromHash(hash);
  const storedKey = input.storedKey ?? readStoredKey() ?? undefined;
  const candidates = [...new Set([urlKey, storedKey].filter((k): k is string => !!k))];
  for (const k of candidates) {
    const cfg = decryptJson<AppConfig>(encrypted, k);
    if (isValidConfig(cfg)) {
      return {
        mode: 'live',
        config: cfg,
        role,
        sessionId: cfg.sessionId || DEFAULT_SESSION_ID,
        fromHashKey: !!urlKey,
        key: k,
      };
    }
  }
  return { mode: 'locked', config: null, role, sessionId: DEFAULT_SESSION_ID, fromHashKey: !!urlKey };
}
