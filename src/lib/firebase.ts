/* firebase.ts — Realtime Database service (the brief's Master-Slave backbone).

   Data model, namespaced by session:
     /sessions/{id}/app_state     { phase, cycle, count, threshold, updatedAt }
     /sessions/{id}/messages/{k}  { cat, text, ts }
     /sessions/{id}/clusters      Cluster[]
     /sessions/{id}/final_report  { map, priorities, conclusion } */

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
  type DataSnapshot,
  type Database,
  type Unsubscribe,
} from 'firebase/database';
import { THRESHOLD } from '../data/catalog';
import type { CategoryKey, Cluster, MissionFinalReport, Phase } from '../state/types';
import type { AppConfig } from './config';

export interface AppStateDoc {
  phase: Phase;
  cycle: number;
  count: number;
  threshold: number;
  updatedAt: number;
}

export interface MessageDoc {
  id: string;
  cat?: CategoryKey;
  text: string;
  ts: number;
}

export interface MissionService {
  readonly sessionId: string;
  onAppState(cb: (s: AppStateDoc | null) => void): Unsubscribe;
  onMessages(cb: (msgs: MessageDoc[]) => void): Unsubscribe;
  onClusters(cb: (c: Cluster[]) => void): Unsubscribe;
  onFinalReport(cb: (r: MissionFinalReport | null) => void): Unsubscribe;
  sendMessage(text: string): Promise<void>;
  setMessageCat(key: string, cat: CategoryKey): Promise<void>;
  setAppState(patch: Partial<AppStateDoc>): Promise<void>;
  setClusters(clusters: Cluster[]): Promise<void>;
  setFinalReport(report: MissionFinalReport): Promise<void>;
  getMessagesOnce(): Promise<MessageDoc[]>;
  clearMessages(): Promise<void>;
  resetMission(): Promise<void>;
}

function snapToMessages(snap: DataSnapshot): MessageDoc[] {
  const out: MessageDoc[] = [];
  snap.forEach((child) => {
    const v = child.val();
    if (v && typeof v.text === 'string') {
      out.push({ id: child.key ?? '', cat: v.cat, text: v.text, ts: v.ts ?? 0 });
    }
    return undefined;
  });
  return out;
}

function toClusters(value: unknown): Cluster[] {
  if (Array.isArray(value)) return value as Cluster[];
  if (value && typeof value === 'object') return Object.values(value) as Cluster[];
  return [];
}

export function createFirebaseService(config: AppConfig, sessionId: string): MissionService {
  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(config.firebase);
  const db: Database = getDatabase(app, config.firebase.databaseURL);
  const base = `sessions/${sessionId}`;
  const appStateRef = ref(db, `${base}/app_state`);
  const messagesRef = ref(db, `${base}/messages`);
  const clustersRef = ref(db, `${base}/clusters`);
  const finalRef = ref(db, `${base}/final_report`);

  return {
    sessionId,
    onAppState: (cb) => onValue(appStateRef, (snap) => cb((snap.val() as AppStateDoc) ?? null)),
    onMessages: (cb) => onValue(messagesRef, (snap) => cb(snapToMessages(snap))),
    onClusters: (cb) => onValue(clustersRef, (snap) => cb(toClusters(snap.val()))),
    onFinalReport: (cb) =>
      onValue(finalRef, (snap) => cb((snap.val() as MissionFinalReport) ?? null)),

    sendMessage: async (text) => {
      await push(messagesRef, { text, ts: Date.now() });
    },
    setMessageCat: async (key, cat) => {
      await update(ref(db, `${base}/messages/${key}`), { cat });
    },
    setAppState: async (patch) => {
      await update(appStateRef, { ...patch, updatedAt: Date.now() });
    },
    setClusters: async (clusters) => {
      await set(clustersRef, clusters);
    },
    setFinalReport: async (report) => {
      await set(finalRef, report);
    },
    getMessagesOnce: async () => snapToMessages(await get(messagesRef)),
    clearMessages: async () => {
      await remove(messagesRef);
    },
    resetMission: async () => {
      await Promise.all([
        remove(messagesRef),
        remove(clustersRef),
        remove(finalRef),
        set(appStateRef, {
          phase: 'start' as Phase,
          cycle: 1,
          count: 0,
          threshold: THRESHOLD,
          updatedAt: Date.now(),
        }),
      ]);
    },
  };
}
