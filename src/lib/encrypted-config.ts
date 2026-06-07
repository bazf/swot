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

export const ENCRYPTED_CONFIG =
  'U2FsdGVkX1/fDwJeMrQY6EGKKAzicLWc6aujL5hc5MGF+BCJ5bSbOQOv/9eTdSx0/VLxx7uSTAh12mMIyLWezih7h2ub2eMLvAL0jNRHiRJp8zotu9gxfeWn3oE0uto9IPYmVzQ2QyqD0OB2qDRsG/LjOwvPL4rHFQNbtG2tescupoSPCdqcCBx2iN8tI88yrv0x2F0yx7yIJwGHy+QmktPAszps7d+kaQEIRC0A4gai8jKMOKMkfEKplMoLF+h1S5z1ajI+CQRR6CEYgi09xCa/Yfoc250sTbKZ5H5IjdNX4vYe+FrKzqVZty+F5Zb9j4bUj4cCwVMxr3SpVCdPgpDlJAy09qd6Gnxo8PfsadJEaOuhhAG257C8E+s8otlYS92JkqEZCfhl0JaHrNjxxLIJWaTsXqoUHxa1r9V2fRRfTw/l5ZEY7VdMPdkhcVgQtJzvB/eeifPxxHM4vnpDOKO2arSqFb3Y1otZWbhqsVN/goKcMUGDLhkV7v7T8ViJIgC2ltx7JYHJMcbv8JaR687QzUsno5ohcfPW0L9gr6i3lpyJJZ8SdEnenFighb81eDWJvdgcsEKapRxggnPSSROVMbfL/3pCrq+UWKpJUW2WxKVFE8Wfockzq9zEMCkRvd+i7r1QND2Ti/4uBJoWYXWXTVnPfbJ65R+CpPBncQx4Sloix9r/fHDGOwpR6fp4';
