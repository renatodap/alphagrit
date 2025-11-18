/**
 * TAILWIND CSS CONFIGURATION
 *
 * Extends Tailwind with our design system tokens.
 * All values pulled from theme.config.ts - no hardcoded values here.
 *
 * @see config/theme.config.ts
 */

import type { Config } from 'tailwindcss'
import { theme } from './config/theme.config'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /**
       * COLORS
       * Pulled from theme.config.ts color system
       */
      colors: {
        // CSS variable colors for dynamic theming
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Primary brand colors (orange)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          ...theme.colors.primary,
        },

        // Accent colors (red)
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          ...theme.colors.accent,
        },

        // Neutral grayscale
        neutral: theme.colors.neutral,

        // Semantic colors
        success: theme.colors.semantic.success,
        warning: theme.colors.semantic.warning,
        error: theme.colors.semantic.error,
        info: theme.colors.semantic.info,

        // Shadcn-style semantic colors
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      /**
       * SPACING
       * Extends Tailwind's default spacing with our custom scale
       */
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      /**
       * BORDER RADIUS
       * Uses CSS variables for dynamic theming
       */
      borderRadius: {
        ...theme.borderRadius,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /**
       * TYPOGRAPHY
       * Font families, sizes, weights from theme config
       */
      fontFamily: {
        sans: theme.typography.fontFamily.sans.split(', '),
        display: theme.typography.fontFamily.display.split(', '),
        mono: theme.typography.fontFamily.mono.split(', '),
      },
      fontSize: {
        xs: [theme.typography.fontSize.xs.size, { lineHeight: theme.typography.fontSize.xs.lineHeight }],
        sm: [theme.typography.fontSize.sm.size, { lineHeight: theme.typography.fontSize.sm.lineHeight }],
        base: [theme.typography.fontSize.base.size, { lineHeight: theme.typography.fontSize.base.lineHeight }],
        lg: [theme.typography.fontSize.lg.size, { lineHeight: theme.typography.fontSize.lg.lineHeight }],
        xl: [theme.typography.fontSize.xl.size, { lineHeight: theme.typography.fontSize.xl.lineHeight }],
        '2xl': [theme.typography.fontSize['2xl'].size, { lineHeight: theme.typography.fontSize['2xl'].lineHeight }],
        '3xl': [theme.typography.fontSize['3xl'].size, { lineHeight: theme.typography.fontSize['3xl'].lineHeight }],
        '4xl': [theme.typography.fontSize['4xl'].size, { lineHeight: theme.typography.fontSize['4xl'].lineHeight }],
        '5xl': [theme.typography.fontSize['5xl'].size, { lineHeight: theme.typography.fontSize['5xl'].lineHeight }],
        '6xl': [theme.typography.fontSize['6xl'].size, { lineHeight: theme.typography.fontSize['6xl'].lineHeight }],
        '7xl': [theme.typography.fontSize['7xl'].size, { lineHeight: theme.typography.fontSize['7xl'].lineHeight }],
        '8xl': [theme.typography.fontSize['8xl'].size, { lineHeight: theme.typography.fontSize['8xl'].lineHeight }],
        '9xl': [theme.typography.fontSize['9xl'].size, { lineHeight: theme.typography.fontSize['9xl'].lineHeight }],
      },
      fontWeight: {
        light: theme.typography.fontWeight.light,
        normal: theme.typography.fontWeight.normal,
        medium: theme.typography.fontWeight.medium,
        semibold: theme.typography.fontWeight.semibold,
        bold: theme.typography.fontWeight.bold,
        extrabold: theme.typography.fontWeight.extrabold,
        black: theme.typography.fontWeight.black,
      },
      lineHeight: theme.typography.lineHeight,
      letterSpacing: theme.typography.letterSpacing,

      /**
       * SHADOWS
       * Box shadow elevation system
       */
      boxShadow: theme.shadows,

      /**
       * ANIMATIONS
       * Keyframes and animation presets
       */
      animation: {
        'fade-in': `fadeIn ${theme.animation.duration.slow} ${theme.animation.easing.easeOut}`,
        'fade-out': `fadeOut ${theme.animation.duration.slow} ${theme.animation.easing.easeOut}`,
        'slide-up': `slideUp ${theme.animation.duration.normal} ${theme.animation.easing.easeOut}`,
        'slide-down': `slideDown ${theme.animation.duration.normal} ${theme.animation.easing.easeOut}`,
        'slide-in-left': `slideInLeft ${theme.animation.duration.normal} ${theme.animation.easing.easeOut}`,
        'slide-in-right': `slideInRight ${theme.animation.duration.normal} ${theme.animation.easing.easeOut}`,
        'scale-in': `scaleIn ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}`,
        'spin': `spin ${theme.animation.duration.slowest} ${theme.animation.easing.linear} infinite`,
        'pulse': `pulse ${theme.animation.duration.slower} ${theme.animation.easing.easeInOut} infinite`,
      },
      keyframes: theme.animation.keyframes,

      /**
       * CONTAINER MAX WIDTHS
       */
      maxWidth: {
        '8xl': theme.container['2xl'],
        '9xl': theme.container['3xl'],
      },

      /**
       * TRANSITIONS
       * Duration and easing
       */
      transitionDuration: {
        instant: theme.animation.duration.instant,
        fast: theme.animation.duration.fast,
        base: theme.animation.duration.base,
        normal: theme.animation.duration.normal,
        slow: theme.animation.duration.slow,
        slower: theme.animation.duration.slower,
        slowest: theme.animation.duration.slowest,
      },
      transitionTimingFunction: theme.animation.easing,

      /**
       * Z-INDEX
       */
      zIndex: theme.zIndex,
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
