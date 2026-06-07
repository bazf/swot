import { isAdminMode, readRole } from './session';

describe('session', () => {
  it('reads the board role from the query string', () => {
    expect(readRole('?role=board', '')).toBe('board');
  });
  it('reads the board role from the hash', () => {
    expect(readRole('', '#role=board')).toBe('board');
  });
  it('defaults to the phone role', () => {
    expect(readRole('', '')).toBe('phone');
    expect(readRole('?role=anything', '')).toBe('phone');
  });
  it('detects the admin flag', () => {
    expect(isAdminMode('?admin=1')).toBe(true);
    expect(isAdminMode('?admin=true')).toBe(true);
    expect(isAdminMode('?foo=bar')).toBe(false);
    expect(isAdminMode('')).toBe(false);
  });
});
