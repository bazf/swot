/* useTheme — persisted dark/light theme (localStorage 'glx-theme'). */

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const KEY = 'glx-theme';

export function useTheme(defaultTheme: Theme = 'dark') {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(KEY) as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  return { theme, setTheme, toggle };
}

/** Root className helper. */
export const themeClass = (theme: Theme) => 'app-root' + (theme === 'light' ? ' theme-light' : '');
