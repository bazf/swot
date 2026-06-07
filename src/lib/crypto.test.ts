import CryptoJS from 'crypto-js';
import {
  clearStoredKey,
  decryptConfig,
  decryptJson,
  encryptConfig,
  encryptJson,
  readHashParam,
  readKeyFromHash,
  readStoredKey,
  scrubHash,
  storeKey,
} from './crypto';

describe('crypto', () => {
  it('round-trips text (incl. Cyrillic)', () => {
    const ct = encryptConfig('привіт світ', 'pw');
    expect(ct).not.toContain('привіт');
    expect(decryptConfig(ct, 'pw')).toBe('привіт світ');
  });

  it('returns null on the wrong password — every time, not just by luck', () => {
    // Raw AES-CBC decrypts wrong-key junk to a plausible string ~1% of the time
    // (a different random salt per run), which made this assertion flaky. The
    // sealed integrity header must reject the wrong password across many salts.
    for (let i = 0; i < 50; i++) {
      const ct = encryptConfig('secret', 'pw');
      expect(decryptConfig(ct, 'nope')).toBeNull();
    }
  });

  it('still decrypts legacy (untagged) ciphertext for the committed config', () => {
    // The already-committed ENCRYPTED_CONFIG predates the integrity header, so
    // raw AES ciphertext (no glx1: envelope) must keep decrypting with its key.
    const legacy = CryptoJS.AES.encrypt('legacy-secret', 'pw').toString();
    expect(legacy.startsWith('glx1:')).toBe(false);
    expect(decryptConfig(legacy, 'pw')).toBe('legacy-secret');
  });

  it('round-trips JSON', () => {
    const obj = { a: 1, b: 'два', firebase: { databaseURL: 'x' } };
    expect(decryptJson(encryptJson(obj, 'k'), 'k')).toEqual(obj);
  });

  it('decryptJson returns null on wrong password', () => {
    expect(decryptJson(encryptJson({ a: 1 }, 'k'), 'bad')).toBeNull();
  });

  it('reads the key + params from the hash', () => {
    expect(readKeyFromHash('#key=abc')).toBe('abc');
    expect(readKeyFromHash('#role=board&key=xyz')).toBe('xyz');
    expect(readKeyFromHash('#role=board')).toBeNull();
    expect(readHashParam('role', '#role=board&key=x')).toBe('board');
  });

  it('scrubs the hash from the address bar', () => {
    window.history.replaceState(null, '', '/swot/?x=1#key=secret');
    scrubHash();
    expect(window.location.hash).toBe('');
    expect(window.location.search).toBe('?x=1');
  });

  it('remembers and forgets the access key', () => {
    clearStoredKey();
    expect(readStoredKey()).toBeNull();
    storeKey('hunter2');
    expect(readStoredKey()).toBe('hunter2');
    clearStoredKey();
    expect(readStoredKey()).toBeNull();
  });
});
