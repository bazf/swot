/* ─────────────────────────────────────────────────────────────────────────────
 * AES-encrypted application config (Firebase + OpenRouter).
 *
 * HOW TO POPULATE:
 *   1. Open the app with the admin flag:  …/swot/?admin=1
 *   2. Paste your Firebase config + OpenRouter key, choose an encryption password.
 *   3. Click "Зашифрувати", copy the ciphertext, and paste it below.
 *   4. Commit this file. Distribute the URL with the password in the hash:
 *        board:  …/swot/?role=board#key=YOUR_PASSWORD
 *        phones: …/swot/#key=YOUR_PASSWORD
 *
 * An EMPTY string keeps the app in offline DEMO mode (no Firebase, no AI) — which
 * is what the public showcase and the e2e tests run against.
 *
 * Never commit plaintext keys here; only the AES ciphertext belongs in this file.
 * ───────────────────────────────────────────────────────────────────────────── */

export const ENCRYPTED_CONFIG = '';
