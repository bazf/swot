/* MobileClient — the teacher's phone client (Slave); screen depends on phase. */

import type { Phase } from '../../state/types';
import { Starfield } from '../cosmos';
import { FinishedScreen } from './FinishedScreen';
import { InputForm } from './InputForm';
import { JoinScreen } from './JoinScreen';
import { ProcessingOverlay } from './ProcessingOverlay';

interface MobileClientProps {
  phase: Phase;
  onSubmit?: (text: string) => void;
  onOpenReport: () => void;
}

export function MobileClient({ phase, onSubmit, onOpenReport }: MobileClientProps) {
  const showForm = phase === 'collecting' || phase === 'clusters' || phase === 'critical';
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--space-1)' }}>
      <div className="cosmos-bg" style={{ position: 'absolute', inset: 0 }} />
      <Starfield count={36} seed={4} />
      {phase === 'start' && <JoinScreen />}
      {showForm && <InputForm onSubmit={onSubmit} />}
      {phase === 'critical' && <ProcessingOverlay />}
      {phase === 'starmap' && <FinishedScreen onOpenReport={onOpenReport} />}
    </div>
  );
}
