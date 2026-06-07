/* App — routes between admin tool, offline demo, locked screen and live mission.
   The live mission (Firebase) is lazy-loaded so demo mode stays lightweight. */

import { lazy, Suspense, useEffect, useMemo } from 'react';
import { AdminConfigForm } from './components/admin/AdminConfigForm';
import { AccessError } from './components/common/AccessError';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Shell } from './components/shell/Shell';
import { resolveConfig } from './lib/config';
import { scrubHash } from './lib/crypto';
import { isAdminMode } from './lib/session';

const LiveApp = lazy(() => import('./components/live/LiveApp').then((m) => ({ default: m.LiveApp })));

export function App() {
  const admin = isAdminMode();
  const res = useMemo(() => resolveConfig(), []);

  // Drop the password from the address bar immediately once it's been read.
  useEffect(() => {
    if (res.fromHashKey) scrubHash();
  }, [res.fromHashKey]);

  if (admin) return <AdminConfigForm />;
  if (res.mode === 'demo') return <Shell />;
  if (res.mode === 'locked' || !res.config) return <AccessError />;
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LiveApp config={res.config} role={res.role} sessionId={res.sessionId} />
    </Suspense>
  );
}
