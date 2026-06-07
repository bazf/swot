import { createContext } from 'react';

/** Scene scale — lets Draggable compensate for the board's scale() transform. */
export const ScaleCtx = createContext(1);
