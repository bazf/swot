/* session.ts — role, admin-flag and session-id resolution. */

import type { Role } from '../state/types';
import { readHashParam } from './crypto';

export const DEFAULT_SESSION_ID = 'mission-1946';

/** Master (board) vs slave (phone). Role can come from ?role= or #role=. */
export function readRole(
  search: string = location.search,
  hash: string = location.hash,
): Role {
  const fromQuery = new URLSearchParams(search).get('role');
  const role = fromQuery ?? readHashParam('role', hash);
  return role === 'board' ? 'board' : 'phone';
}

/** The hidden admin form is reachable at ?admin=1. */
export function isAdminMode(search: string = location.search): boolean {
  const v = new URLSearchParams(search).get('admin');
  return v === '1' || v === 'true';
}

export function defaultSessionId(): string {
  return import.meta.env.VITE_SESSION_ID || DEFAULT_SESSION_ID;
}
