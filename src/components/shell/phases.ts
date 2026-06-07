import type { Phase } from '../../state/types';

export const PHASES: { key: Phase; label: string }[] = [
  { key: 'start', label: 'Старт' },
  { key: 'collecting', label: 'Накопичення' },
  { key: 'critical', label: 'Критична маса' },
  { key: 'clusters', label: 'Кластери' },
  { key: 'starmap', label: 'Зоряна карта' },
];
