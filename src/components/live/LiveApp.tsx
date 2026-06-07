/* LiveApp — builds the Firebase service once and routes by role. */

import { useMemo } from 'react';
import type { AppConfig } from '../../lib/config';
import { createFirebaseService } from '../../lib/firebase';
import type { OpenRouterOptions } from '../../lib/openrouter';
import type { Role } from '../../state/types';
import { LiveBoard } from './LiveBoard';
import { LivePhone } from './LivePhone';

interface LiveAppProps {
  config: AppConfig;
  role: Role;
  sessionId: string;
}

export function LiveApp({ config, role, sessionId }: LiveAppProps) {
  const service = useMemo(() => createFirebaseService(config, sessionId), [config, sessionId]);
  const orOpts: OpenRouterOptions = useMemo(
    () => ({ key: config.openrouter.key, model: config.openrouter.model }),
    [config],
  );
  return role === 'board' ? <LiveBoard service={service} orOpts={orOpts} /> : <LivePhone service={service} orOpts={orOpts} />;
}
