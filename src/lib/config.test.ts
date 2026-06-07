import { resolveConfig } from './config';
import { encryptJson } from './crypto';

const cfg = {
  firebase: { apiKey: 'a', authDomain: '', databaseURL: 'https://db.example', projectId: 'p' },
  openrouter: { key: 'k' },
};

describe('resolveConfig', () => {
  it('is demo mode with no committed ciphertext', () => {
    expect(resolveConfig({ encrypted: '', hash: '', search: '', env: {} }).mode).toBe('demo');
  });

  it('is locked when a ciphertext exists but no key is given', () => {
    const ct = encryptJson(cfg, 'pw');
    expect(resolveConfig({ encrypted: ct, hash: '', search: '', env: {} }).mode).toBe('locked');
  });

  it('is locked when the key is wrong', () => {
    const ct = encryptJson(cfg, 'pw');
    expect(resolveConfig({ encrypted: ct, hash: '#key=bad', search: '', env: {} }).mode).toBe('locked');
  });

  it('is live with the correct key, and flags the hash source', () => {
    const ct = encryptJson(cfg, 'pw');
    const r = resolveConfig({ encrypted: ct, hash: '#key=pw', search: '', env: {} });
    expect(r.mode).toBe('live');
    expect(r.config?.firebase.databaseURL).toBe('https://db.example');
    expect(r.fromHashKey).toBe(true);
  });

  it('reads the board role alongside the key', () => {
    const ct = encryptJson(cfg, 'pw');
    const r = resolveConfig({ encrypted: ct, hash: '#key=pw', search: '?role=board', env: {} });
    expect(r.role).toBe('board');
  });

  it('supports local env-driven live mode', () => {
    const r = resolveConfig({
      encrypted: '',
      hash: '',
      search: '',
      env: { VITE_LOCAL_LIVE: '1', VITE_FB_API_KEY: 'a', VITE_FB_DATABASE_URL: 'https://db' },
    });
    expect(r.mode).toBe('live');
    expect(r.fromHashKey).toBe(false);
  });

  it('forces demo mode with ?demo=1 even when a ciphertext is committed', () => {
    const ct = encryptJson(cfg, 'pw');
    const r = resolveConfig({ encrypted: ct, hash: '#key=pw', search: '?demo=1', env: {} });
    expect(r.mode).toBe('demo');
  });

  it('reuses a remembered key when the URL has none', () => {
    const ct = encryptJson(cfg, 'pw');
    const r = resolveConfig({ encrypted: ct, hash: '', search: '', env: {}, storedKey: 'pw' });
    expect(r.mode).toBe('live');
    expect(r.key).toBe('pw');
    expect(r.fromHashKey).toBe(false);
  });

  it('lets a URL key override the remembered key', () => {
    const ct = encryptJson(cfg, 'pw');
    const r = resolveConfig({ encrypted: ct, hash: '#key=pw', search: '', env: {}, storedKey: 'stale' });
    expect(r.mode).toBe('live');
    expect(r.key).toBe('pw');
    expect(r.fromHashKey).toBe(true);
  });

  it('falls back to a valid remembered key when the URL key is wrong', () => {
    const ct = encryptJson(cfg, 'pw');
    const r = resolveConfig({ encrypted: ct, hash: '#key=wrong', search: '', env: {}, storedKey: 'pw' });
    expect(r.mode).toBe('live');
    expect(r.key).toBe('pw');
  });
});
