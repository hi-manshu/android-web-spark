import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '3rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        paper: '#FBFAF7',
        ink: '#111111',
        surface: '#FFFFFF',
        dim: '#6B6963',
        line: '#E6E2D9',
        ember: { DEFAULT: '#E31E24', soft: '#FBE3E4' },
        gold: '#E8C547',
        // shadcn tokens (driven by CSS variables in index.css)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      letterSpacing: {
        display: '-0.045em',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#3A3835',
            '--tw-prose-headings': '#111111',
            '--tw-prose-lead': '#6B6963',
            '--tw-prose-links': '#111111',
            '--tw-prose-bold': '#111111',
            '--tw-prose-counters': '#6B6963',
            '--tw-prose-bullets': '#C9C4B8',
            '--tw-prose-hr': '#E6E2D9',
            '--tw-prose-quotes': '#111111',
            '--tw-prose-quote-borders': '#E31E24',
            '--tw-prose-captions': '#6B6963',
            '--tw-prose-code': '#111111',
            '--tw-prose-pre-code': '#F2EFE9',
            '--tw-prose-pre-bg': '#111111',
            '--tw-prose-th-borders': '#E6E2D9',
            '--tw-prose-td-borders': '#E6E2D9',
            maxWidth: 'none',
            a: {
              textDecorationColor: '#E31E24',
              textDecorationThickness: '1.5px',
              textUnderlineOffset: '3px',
              '&:hover': { color: '#E31E24' },
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            code: {
              background: '#F1EEE7',
              padding: '0.15em 0.4em',
              borderRadius: '0.35rem',
              fontWeight: '500',
              fontSize: '0.875em',
            },
            pre: { borderRadius: '0.875rem', padding: '1.25rem 1.5rem' },
            'pre code': { background: 'transparent', padding: '0', fontWeight: '400' },
            img: { borderRadius: '0.875rem', border: '1px solid #E6E2D9' },
            h1: { letterSpacing: '-0.03em' },
            h2: { letterSpacing: '-0.025em' },
            h3: { letterSpacing: '-0.015em' },
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
