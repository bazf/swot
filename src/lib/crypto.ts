/* crypto.ts — AES config encryption + URL-hash key handling.

   Matches the brief: the app config (Firebase + OpenRouter keys) is AES-encrypted
   at build time, the ciphertext is committed, and the password is delivered to
   clients in the URL hash (#key=SECRET) and scrubbed from the address bar on load. */

import CryptoJS from 'crypto-js';

/* Raw AES-CBC has no key authentication, so decrypting with the *wrong*
   password still succeeds ~1% of the time — it returns plausible-looking junk
   instead of failing. We therefore seal a fixed integrity header inside the
   ciphertext: on decryption its presence proves the password was correct, so a
   wrong password is rejected deterministically. The `glx1:` envelope tags this
   verifiable format; legacy (untagged) ciphertext is still decrypted
   best-effort so previously committed configs keep working. */
const FORMAT_TAG = 'glx1:';
const HEADER = 'GLX-OK\n';

/** AES-encrypt arbitrary text with a password (OpenSSL-compatible KDF). */
export function encryptConfig(plaintext: string, password: string): string {
  return FORMAT_TAG + CryptoJS.AES.encrypt(HEADER + plaintext, password).toString();
}

/** AES-decrypt; returns null on wrong password / malformed input. */
export function decryptConfig(ciphertext: string, password: string): string | null {
  try {
    if (ciphertext.startsWith(FORMAT_TAG)) {
      const body = CryptoJS.AES.decrypt(ciphertext.slice(FORMAT_TAG.length), password).toString(CryptoJS.enc.Utf8);
      // A correct password reproduces the sealed header; anything else is wrong.
      return body.startsWith(HEADER) ? body.slice(HEADER.length) : null;
    }
    // Legacy untagged ciphertext (e.g. an already-committed config): best-effort
    // decrypt — the config layer's structural validation guards against junk.
    const text = CryptoJS.AES.decrypt(ciphertext, password).toString(CryptoJS.enc.Utf8);
    return text.length ? text : null;
  } catch {
    return null;
  }
}

/** Encrypt a JSON-serializable value. */
export function encryptJson(value: unknown, password: string): string {
  return encryptConfig(JSON.stringify(value), password);
}

/** Decrypt + JSON.parse; returns null on any failure. */
export function decryptJson<T = unknown>(ciphertext: string, password: string): T | null {
  const text = decryptConfig(ciphertext, password);
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function hashParams(hash: string): URLSearchParams {
  const h = hash.startsWith('#') ? hash.slice(1) : hash;
  return new URLSearchParams(h);
}

/** Read the `key` password from the URL hash (#key=SECRET). */
export function readKeyFromHash(hash: string = location.hash): string | null {
  return hashParams(hash).get('key');
}

/** Read an arbitrary param from the URL hash (e.g. role). */
export function readHashParam(name: string, hash: string = location.hash): string | null {
  return hashParams(hash).get(name);
}

/** Remove the hash (and thus the password) from the address bar immediately. */
export function scrubHash(): void {
  try {
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', pathname + search);
  } catch {
    /* history unavailable */
  }
}

const STORED_KEY = 'glx-key';

/** Read the remembered access key from localStorage (null if none / unavailable). */
export function readStoredKey(): string | null {
  try {
    return localStorage.getItem(STORED_KEY);
  } catch {
    return null;
  }
}

/** Remember the access key for subsequent visits (so a refresh stays unlocked). */
export function storeKey(key: string): void {
  try {
    localStorage.setItem(STORED_KEY, key);
  } catch {
    /* storage unavailable */
  }
}

/** Forget the remembered access key. */
export function clearStoredKey(): void {
  try {
    localStorage.removeItem(STORED_KEY);
  } catch {
    /* storage unavailable */
  }
}
