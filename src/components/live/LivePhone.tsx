/* LivePhone — the Slave client on a teacher's own phone (device-agnostic). */

import { useState } from 'react';
import type { MissionService } from '../../lib/firebase';
import type { OpenRouterOptions } from '../../lib/openrouter';
import { useLiveMission } from '../../state/useLiveMission';
import { MobileClient } from '../mobile';
import { ReportOverlay } from '../report';

interface LivePhoneProps {
  service: MissionService;
  orOpts: OpenRouterOptions;
}

export function LivePhone({ service, orOpts }: LivePhoneProps) {
  const m = useLiveMission(service, 'phone', orOpts);
  const [report, setReport] = useState(false);
  return (
    <div className="app-root" style={{ position: 'fixed', inset: 0 }}>
      <MobileClient phase={m.phase} onSubmit={m.addIdea} onOpenReport={() => setReport(true)} />
      {report && <ReportOverlay map={m.map} report={m.report} onClose={() => setReport(false)} />}
    </div>
  );
}
