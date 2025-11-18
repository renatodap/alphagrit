/**
 * ALPHA GRIT DESIGN SYSTEM - MASTER THEME CONFIGURATION
 *
 * This is the single source of truth for all design decisions in the application.
 * Every color, spacing value, animation, and design token is defined here.
 *
 * CORE PRINCIPLES:
 * - No hardcoded values anywhere in the codebase
 * - All components consume from this configuration
 * - Changes here cascade throughout the entire application
 * - Fully typed for autocomplete and type safety
 *
 * @module theme.config
 */

/**
 * COLOR SYSTEM
 *
 * Organized in semantic scales from 50 (lightest) to 950 (darkest).
 * Primary: Main brand color (Orange) - used for CTAs, primary actions
 * Accent: Secondary brand color (Red) - used for emphasis, highlights
 * Neutral: Grayscale palette - used for text, borders, backgrounds
 * Semantic: Status colors - success, warning, error, info
 */
export const colors = {
  /** Main brand color - energetic orange for CTAs and primary actions */
  primary: {
    50: '#fff7ed',   // Lightest tint - subtle backgrounds
    100: '#ffedd5',  // Very light - hover states
    200: '#fed7aa',  // Light - disabled states
    300: '#fdba74',  // Medium light - borders
    400: '#fb923c',  // Medium - secondary buttons
    500: '#f97316',  // MAIN - primary buttons, links, CTAs
    600: '#ea580c',  // Dark - hover states for primary
    700: '#c2410c',  // Darker - active states
    800: '#9a3412',  // Very dark - text on light backgrounds
    900: '#7c2d12',  // Nearly black - headings
    950: '#431407',  // Darkest - high contrast text
  },

  /** Secondary brand color - bold red for emphasis and urgency */
  accent: {
    50: '#fef2f2',   // Lightest red tint
    100: '#fee2e2',  // Very light red
    200: '#fecaca',  // Light red
    300: '#fca5a5',  // Medium light red
    400: '#f87171',  // Medium red
    500: '#ef4444',  // MAIN - accent color, alerts
    600: '#dc2626',  // Dark red - hover states
    700: '#b91c1c',  // Darker red - active states
    800: '#991b1b',  // Very dark red
    900: '#7f1d1d',  // Nearly black red
    950: '#450a0a',  // Darkest red
  },

  /** Grayscale palette for text, borders, and backgrounds */
  neutral: {
    50: '#fafafa',   // Nearly white - subtle backgrounds
    100: '#f5f5f5',  // Very light gray - card backgrounds
    200: '#e5e5e5',  // Light gray - borders, dividers
    300: '#d4d4d4',  // Medium light - disabled elements
    400: '#a3a3a3',  // Medium - placeholders
    500: '#737373',  // Mid gray - secondary text
    600: '#525252',  // Dark gray - body text
    700: '#404040',  // Darker - headings in light mode
    800: '#262626',  // Very dark - dark mode backgrounds
    900: '#171717',  // Nearly black - dark mode cards
    950: '#0a0a0a',  // Pure black - darkest elements
  },

  /** Semantic status colors */
  semantic: {
    /** Success states - green palette */
    success: {
      light: '#86efac',     // Light green for backgrounds
      DEFAULT: '#22c55e',   // Main success color
      dark: '#16a34a',      // Dark green for text
    },
    /** Warning states - amber palette */
    warning: {
      light: '#fde047',     // Light yellow for backgrounds
      DEFAULT: '#eab308',   // Main warning color
      dark: '#ca8a04',      // Dark yellow for text
    },
    /** Error states - red palette (matches accent) */
    error: {
      light: '#fca5a5',     // Light red for backgrounds
      DEFAULT: '#ef4444',   // Main error color
      dark: '#dc2626',      // Dark red for text
    },
    /** Info states - blue palette */
    info: {
      light: '#93c5fd',     // Light blue for backgrounds
      DEFAULT: '#3b82f6',   // Main info color
      dark: '#2563eb',      // Dark blue for text
    },
  },
} as const

/**
 * SPACING SYSTEM
 *
 * Based on 4px base unit with a modular scale.
 * Use these for margins, paddings, gaps, and any spacing needs.
 *
 * Scale: xs → sm → md → lg → xl → 2xl → 3xl → 4xl → 5xl
 */
export const spacing = {
  /** 2px - Minimal spacing, tight layouts */
  xxs: '0.125rem',
  /** 4px - Very tight spacing, component internals */
  xs: '0.25rem',
  /** 8px - Tight spacing, small gaps */
  sm: '0.5rem',
  /** 16px - Standard spacing, default gaps */
  md: '1rem',
  /** 24px - Medium spacing, section gaps */
  lg: '1.5rem',
  /** 32px - Large spacing, component separation */
  xl: '2rem',
  /** 48px - Extra large, section padding */
  '2xl': '3rem',
  /** 64px - Huge spacing, major sections */
  '3xl': '4rem',
  /** 96px - Very large, hero sections */
  '4xl': '6rem',
  /** 128px - Massive spacing, page sections */
  '5xl': '8rem',
  /** 160px - Enormous spacing, special layouts */
  '6xl': '10rem',
} as const

/**
 * TYPOGRAPHY SYSTEM
 *
 * Comprehensive type scale with font families, sizes, weights, and line heights.
 * Designed for optimal readability across all devices.
 */
export const typography = {
  /** Font family stacks */
  fontFamily: {
    /** Primary font for body text and UI */
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'sans-serif',
    ].join(', '),

    /** Display font for large headings and hero text */
    display: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(', '),

    /** Monospace font for code and technical content */
    mono: [
      'SF Mono',
      'Monaco',
      'Cascadia Code',
      'Roboto Mono',
      'Consolas',
      'monospace',
    ].join(', '),
  },

  /** Font sizes with corresponding line heights */
  fontSize: {
    /** 12px - Small labels, captions */
    xs: { size: '0.75rem', lineHeight: '1rem' },
    /** 14px - Small body text, secondary info */
    sm: { size: '0.875rem', lineHeight: '1.25rem' },
    /** 16px - Default body text */
    base: { size: '1rem', lineHeight: '1.5rem' },
    /** 18px - Large body text, lead paragraphs */
    lg: { size: '1.125rem', lineHeight: '1.75rem' },
    /** 20px - Small headings */
    xl: { size: '1.25rem', lineHeight: '1.75rem' },
    /** 24px - H5 headings */
    '2xl': { size: '1.5rem', lineHeight: '2rem' },
    /** 30px - H4 headings */
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
    /** 36px - H3 headings */
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
    /** 48px - H2 headings */
    '5xl': { size: '3rem', lineHeight: '1.2' },
    /** 60px - H1 headings */
    '6xl': { size: '3.75rem', lineHeight: '1.1' },
    /** 72px - Hero text */
    '7xl': { size: '4.5rem', lineHeight: '1' },
    /** 96px - Display text */
    '8xl': { size: '6rem', lineHeight: '1' },
    /** 128px - Massive display text */
    '9xl': { size: '8rem', lineHeight: '1' },
  },

  /** Font weights */
  fontWeight: {
    /** 300 - Thin text, rarely used */
    light: '300',
    /** 400 - Normal body text */
    normal: '400',
    /** 500 - Medium emphasis */
    medium: '500',
    /** 600 - Semi-bold headings */
    semibold: '600',
    /** 700 - Bold emphasis */
    bold: '700',
    /** 800 - Extra bold, strong emphasis */
    extrabold: '800',
    /** 900 - Black, maximum emphasis */
    black: '900',
  },

  /** Line heights for different contexts */
  lineHeight: {
    /** 1.25 - Tight line height for headings */
    tight: '1.25',
    /** 1.5 - Normal line height for body text */
    normal: '1.5',
    /** 1.75 - Relaxed line height for long-form content */
    relaxed: '1.75',
    /** 2 - Loose line height for maximum readability */
    loose: '2',
  },

  /** Letter spacing */
  letterSpacing: {
    /** -0.05em - Tighter tracking for large text */
    tight: '-0.05em',
    /** 0 - Normal tracking */
    normal: '0',
    /** 0.025em - Slight tracking for readability */
    wide: '0.025em',
    /** 0.05em - Wide tracking for all-caps text */
    wider: '0.05em',
    /** 0.1em - Widest tracking for emphasis */
    widest: '0.1em',
  },
} as const

/**
 * BORDER RADIUS SYSTEM
 *
 * Rounded corner radii for UI elements.
 * Scale: none → sm → md → lg → xl → 2xl → full
 */
export const borderRadius = {
  /** 0 - No rounding, sharp corners */
  none: '0',
  /** 4px - Slight rounding, subtle */
  sm: '0.25rem',
  /** 8px - Standard rounding, buttons and cards */
  md: '0.5rem',
  /** 12px - Medium rounding */
  lg: '0.75rem',
  /** 16px - Large rounding, prominent cards */
  xl: '1rem',
  /** 24px - Extra large rounding */
  '2xl': '1.5rem',
  /** 32px - Huge rounding */
  '3xl': '2rem',
  /** 9999px - Full circle/pill shape */
  full: '9999px',
} as const

/**
 * SHADOW SYSTEM
 *
 * Elevation shadows for creating depth and hierarchy.
 * Use shadows to lift elements and create visual layers.
 */
export const shadows = {
  /** No shadow - flat elements */
  none: 'none',
  /** Subtle shadow - slight elevation */
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  /** Default shadow - standard elevation */
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  /** Medium-large shadow - elevated cards */
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  /** Large shadow - floating elements */
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  /** Extra large shadow - modals and overlays */
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  /** Inner shadow - inset effects */
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

/**
 * ANIMATION SYSTEM
 *
 * Timing, easing, and duration values for all animations.
 * Consistent motion creates a cohesive user experience.
 */
export const animation = {
  /** Duration values in milliseconds */
  duration: {
    /** 100ms - Instant feedback */
    instant: '100ms',
    /** 150ms - Fast transitions */
    fast: '150ms',
    /** 200ms - Default transition speed */
    base: '200ms',
    /** 300ms - Standard animations */
    normal: '300ms',
    /** 500ms - Slow, dramatic animations */
    slow: '500ms',
    /** 700ms - Very slow, cinematic */
    slower: '700ms',
    /** 1000ms - Long animations, page transitions */
    slowest: '1000ms',
  },

  /** Easing functions for natural motion */
  easing: {
    /** Linear - constant speed */
    linear: 'linear',
    /** Ease in - start slow, end fast */
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    /** Ease out - start fast, end slow (most natural for UI) */
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    /** Ease in-out - slow both ends */
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    /** Spring - bouncy, playful motion */
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  /** Combined transition presets */
  transition: {
    /** Quick color changes */
    colors: 'color 150ms cubic-bezier(0, 0, 0.2, 1), background-color 150ms cubic-bezier(0, 0, 0.2, 1), border-color 150ms cubic-bezier(0, 0, 0.2, 1)',
    /** Transform animations */
    transform: 'transform 300ms cubic-bezier(0, 0, 0.2, 1)',
    /** Opacity fades */
    opacity: 'opacity 200ms cubic-bezier(0, 0, 0.2, 1)',
    /** All properties */
    all: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
  },

  /** Keyframe animations */
  keyframes: {
    /** Fade in from transparent to opaque */
    fadeIn: {
      from: { opacity: '0' },
      to: { opacity: '1' },
    },
    /** Fade out from opaque to transparent */
    fadeOut: {
      from: { opacity: '1' },
      to: { opacity: '0' },
    },
    /** Slide up from below */
    slideUp: {
      from: { transform: 'translateY(10px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' },
    },
    /** Slide down from above */
    slideDown: {
      from: { transform: 'translateY(-10px)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' },
    },
    /** Slide in from left */
    slideInLeft: {
      from: { transform: 'translateX(-100%)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' },
    },
    /** Slide in from right */
    slideInRight: {
      from: { transform: 'translateX(100%)', opacity: '0' },
      to: { transform: 'translateX(0)', opacity: '1' },
    },
    /** Scale up from center */
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: '0' },
      to: { transform: 'scale(1)', opacity: '1' },
    },
    /** Spin 360 degrees */
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    /** Pulse effect for loading states */
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '0.5' },
    },
  },
} as const

/**
 * RESPONSIVE BREAKPOINTS
 *
 * Mobile-first breakpoint system.
 * Design for mobile first, then enhance for larger screens.
 */
export const breakpoints = {
  /** 640px - Large phones, small tablets */
  sm: '640px',
  /** 768px - Tablets, iPad portrait */
  md: '768px',
  /** 1024px - Small laptops, iPad landscape */
  lg: '1024px',
  /** 1280px - Desktops */
  xl: '1280px',
  /** 1536px - Large desktops */
  '2xl': '1536px',
  /** 1920px - Extra large desktops */
  '3xl': '1920px',
} as const

/**
 * Z-INDEX SYSTEM
 *
 * Stacking order for layered UI elements.
 * Use these values to maintain consistent layering throughout the app.
 */
export const zIndex = {
  /** -1 - Behind everything */
  behind: '-1',
  /** 0 - Base layer */
  base: '0',
  /** 10 - Raised elements */
  raised: '10',
  /** 20 - Dropdowns */
  dropdown: '20',
  /** 30 - Sticky elements */
  sticky: '30',
  /** 40 - Fixed elements */
  fixed: '40',
  /** 50 - Modal backdrop */
  modalBackdrop: '50',
  /** 60 - Modals */
  modal: '60',
  /** 70 - Popovers */
  popover: '70',
  /** 80 - Tooltips */
  tooltip: '80',
  /** 90 - Toasts/notifications */
  toast: '90',
  /** 100 - Maximum z-index */
  maximum: '100',
} as const

/**
 * CONTAINER SYSTEM
 *
 * Max-width constraints for content containers.
 * Prevents content from becoming too wide on large screens.
 */
export const container = {
  /** 640px - Narrow content, forms */
  sm: '640px',
  /** 768px - Standard content */
  md: '768px',
  /** 1024px - Wide content */
  lg: '1024px',
  /** 1280px - Full width content */
  xl: '1280px',
  /** 1536px - Extra wide content */
  '2xl': '1536px',
  /** 1920px - Maximum width */
  '3xl': '1920px',
} as const

/**
 * MASTER THEME OBJECT
 *
 * Combines all design tokens into a single exportable object.
 * Import this in components to access any design value.
 */
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  breakpoints,
  zIndex,
  container,
} as const

/** TypeScript type for the theme object */
export type Theme = typeof theme

/** Export default theme */
export default theme
