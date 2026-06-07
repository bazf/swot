/* LivePhone — the Slave client on a teacher's own phone (device-agnostic).
   Defaults to light theme with a toggle. */

import { useState } from 'react';
import type { MissionService } from '../../lib/firebase';
import type { OpenRouterOptions } from '../../lib/openrouter';
import { useLiveMission } from '../../state/useLiveMission';
import { themeClass, useTheme } from '../../state/useTheme';
import { ThemeToggle } from '../common/ThemeToggle';
import { MobileClient } from '../mobile';
import { ReportOverlay } from '../report';

interface LivePhoneProps {
  service: MissionService;
  orOpts: OpenRouterOptions;
}

export function LivePhone({ service, orOpts }: LivePhoneProps) {
  const m = useLiveMission(service, 'phone', orOpts);
  const { theme, toggle } = useTheme('light');
  const [report, setReport] = useState(false);
  return (
    <div className={themeClass(theme)} style={{ position: 'fixed', inset: 0 }}>
      <MobileClient phase={m.phase} onSubmit={m.addIdea} onOpenReport={() => setReport(true)} />
      <ThemeToggle theme={theme} onToggle={toggle} style={{ position: 'absolute', top: 14, right: 16, zIndex: 70 }} />
      {report && <ReportOverlay map={m.map} report={m.report} onClose={() => setReport(false)} />}
    </div>
  );
}
