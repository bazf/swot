/* useLiveMission — binds the mission API to Firebase (master/slave). */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FINAL_REPORT, STAR_MAP, THRESHOLD } from '../data/catalog';
import type { AppStateDoc, MessageDoc, MissionService } from '../lib/firebase';
import { clusterIdeas, finalAnalysis, type OpenRouterOptions } from '../lib/openrouter';
import { computeVoteStats } from '../lib/stats';
import type { CategoryKey, Cluster, Idea, MissionApi, MissionFinalReport, Phase, Role } from './types';

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable pseudo-random board position derived from a message id. */
function posFromId(id: string): { x: number; y: number } {
  const h = hashStr(id);
  const ang = ((h % 360) * Math.PI) / 180;
  const rad = 205 + (h % 150);
  const x = 640 + Math.cos(ang) * rad - 95;
  const y = 360 + Math.sin(ang) * rad * 0.72 - 22;
  return { x: Math.max(18, Math.min(1075, x)), y: Math.max(82, Math.min(612, y)) };
}

const toClusterInput = (msgs: MessageDoc[]) => msgs.map((m) => ({ cat: m.cat, text: m.text, ts: m.ts }));

export function useLiveMission(service: MissionService, role: Role, orOpts: OpenRouterOptions): MissionApi {
  const [appState, setAppState] = useState<AppStateDoc | null>(null);
  const [messages, setMessages] = useState<MessageDoc[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [finalReport, setFinalReport] = useState<MissionFinalReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [finalizing, setFinalizing] = useState(false);

  // Every thought the board has ever seen, keyed by message id. Firebase clears
  // /messages after each clustering cycle, so this is the only complete record of
  // the session's votes — the source for the finale's deterministic statistics.
  const allMessagesRef = useRef<Map<string, MessageDoc>>(new Map());
  const remember = useCallback((msgs: MessageDoc[]) => {
    for (const m of msgs) if (m.id) allMessagesRef.current.set(m.id, m);
  }, []);

  useEffect(() => {
    const unsubs = [
      service.onAppState(setAppState),
      service.onClusters(setClusters),
      service.onFinalReport(setFinalReport),
    ];
    if (role === 'board') {
      unsubs.push(
        service.onMessages((msgs) => {
          setMessages(msgs);
          remember(msgs);
        }),
      );
    }
    return () => unsubs.forEach((u) => u());
  }, [service, role, remember]);

  const phase: Phase = appState?.phase ?? 'start';
  const cycle = appState?.cycle ?? 1;
  const count = role === 'board' ? messages.length : appState?.count ?? 0;

  // Board mirrors the live message count → app_state and flips to critical at 40.
  useEffect(() => {
    if (role !== 'board') return;
    if (phase !== 'collecting' && phase !== 'critical') return;
    const n = messages.length;
    if (phase === 'collecting' && n >= THRESHOLD) {
      void service.setAppState({ phase: 'critical', count: n });
    } else if (n !== (appState?.count ?? -1)) {
      void service.setAppState({ count: n });
    }
  }, [role, phase, messages.length, appState?.count, service]);

  const ideas: Idea[] = useMemo(
    () =>
      messages.slice(-THRESHOLD).map((m, i) => ({
        id: i + 1,
        key: m.id,
        cat: m.cat,
        text: m.text,
        ...posFromId(m.id || String(i)),
        delay: 0,
        fl: 5,
      })),
    [messages],
  );

  const start = useCallback(() => {
    void service.setAppState({ phase: 'collecting', count: 0 });
  }, [service]);

  const addIdea = useCallback(
    (text?: string) => {
      if (text) void service.sendMessage(text);
    },
    [service],
  );

  const assignCategory = useCallback(
    (idea: Idea, cat: CategoryKey) => {
      if (idea.key) void service.setMessageCat(idea.key, cat);
    },
    [service],
  );

  const swipe = useCallback(async () => {
    setBusy(true);
    try {
      const msgs = await service.getMessagesOnce();
      const cl = await clusterIdeas(toClusterInput(msgs), orOpts);
      await service.setClusters(cl);
      await service.clearMessages();
      await service.setAppState({ phase: 'clusters', count: 0, cycle: cycle + 1 });
    } finally {
      setBusy(false);
    }
  }, [service, orOpts, cycle]);

  const continueCycle = useCallback(() => {
    void service.setAppState({ phase: 'collecting', count: 0 });
  }, [service]);

  const finalizeFrom = useCallback(
    async (cl: Cluster[]) => {
      const report = await finalAnalysis(cl, orOpts);
      // Count the votes locally (proportions + similar votes) — always real, even
      // when the AI synthesis fell back to the sample report.
      const stats = computeVoteStats([...allMessagesRef.current.values()]);
      const withStats = { ...report, stats: stats.total > 0 ? stats : report.stats };
      await service.setFinalReport(withStats);
      await service.setAppState({ phase: 'starmap' });
    },
    [service, orOpts],
  );

  const finish = useCallback(async () => {
    setBusy(true);
    setFinalizing(true);
    try {
      await finalizeFrom(clusters);
    } finally {
      setBusy(false);
      setFinalizing(false);
    }
  }, [finalizeFrom, clusters]);

  // Wrap up from any phase: cluster whatever raw thoughts remain, then finalize.
  const finishNow = useCallback(async () => {
    setBusy(true);
    setFinalizing(true);
    try {
      const msgs = await service.getMessagesOnce();
      remember(msgs);
      let cl = clusters;
      if (msgs.length) {
        cl = await clusterIdeas(toClusterInput(msgs), orOpts);
        await service.setClusters(cl);
        await service.clearMessages();
      }
      await finalizeFrom(cl);
    } finally {
      setBusy(false);
      setFinalizing(false);
    }
  }, [service, orOpts, clusters, finalizeFrom, remember]);

  const reset = useCallback(() => {
    allMessagesRef.current.clear();
    void service.resetMission();
  }, [service]);

  const map = finalReport?.map ?? STAR_MAP;
  const report = finalReport ?? FINAL_REPORT;

  return {
    phase,
    ideas,
    count,
    cycle,
    clusters,
    map,
    report,
    busy,
    finalizing,
    start,
    addIdea,
    assignCategory,
    swipe,
    continueCycle,
    finish,
    finishNow,
    reset,
    jump: () => {},
  };
}
