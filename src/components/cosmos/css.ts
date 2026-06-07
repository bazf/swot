import type { CSSProperties } from 'react';

/** CSSProperties that also accept `--custom` CSS variables. */
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;
