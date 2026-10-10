// Design tokens for BazarDor - centralized design system values

export const colors = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  success: {
    light: '#dcfce7',
    DEFAULT: '#16a34a',
    dark: '#15803d',
  },
  danger: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const;

export const fontFamily = {
  hind: 'var(--font-hind-siliguri), system-ui, sans-serif',
} as const;

export const fontSize = {
  'display-xl': { size: '4.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' },
  'display-lg': { size: '3.75rem', lineHeight: '1.1', letterSpacing: '-0.02em' },
  'display-md': { size: '3rem', lineHeight: '1.2', letterSpacing: '-0.01em' },
  'display-sm': { size: '2.25rem', lineHeight: '1.3' },
  'heading-xl': { size: '1.875rem', lineHeight: '1.3' },
  'heading-lg': { size: '1.5rem', lineHeight: '1.4' },
  'heading-md': { size: '1.25rem', lineHeight: '1.4' },
  'heading-sm': { size: '1.125rem', lineHeight: '1.5' },
  'body-lg': { size: '1.125rem', lineHeight: '1.6' },
  'body-md': { size: '1rem', lineHeight: '1.6' },
  'body-sm': { size: '0.875rem', lineHeight: '1.5' },
  'caption': { size: '0.75rem', lineHeight: '1.5' },
} as const;

export const spacing = {
  '18': '4.5rem',
  '22': '5.5rem',
  '26': '6.5rem',
  '30': '7.5rem',
} as const;

export const borderRadius = {
  '4xl': '2rem',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
} as const;

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
} as const;

export type ColorScale = keyof typeof colors.primary;
export type FontSizeKey = keyof typeof fontSize;
export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;
export type BreakpointKey = keyof typeof breakpoints;
export type ZIndexKey = keyof typeof zIndex;
export type TransitionKey = keyof typeof transitions;