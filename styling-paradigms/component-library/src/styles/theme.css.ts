import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    // Primary / Secondary / Danger
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    secondary: '#64748b',
    secondaryHover: '#475569',
    danger: '#ef4444',
    dangerHover: '#dc2626',

    // Status Badges
    successBg: '#dcfce7',
    successText: '#15803d',
    warningBg: '#fef9c3',
    warningText: '#a16207',
    errorBg: '#fee2e2',
    errorText: '#b91c1c',

    // Surfaces & Text
    bgSurface: '#ffffff',
    bgApp: '#f8fafc',
    textMain: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
  font: {
    body: 'system-ui, -apple-system, sans-serif',
  },
});