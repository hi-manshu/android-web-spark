
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Material 3 System Colors
				'md-sys-color': {
					primary: 'hsl(var(--md-sys-color-primary))',
					'on-primary': 'hsl(var(--md-sys-color-on-primary))',
					'primary-container': 'hsl(var(--md-sys-color-primary-container))',
					'on-primary-container': 'hsl(var(--md-sys-color-on-primary-container))',
					secondary: 'hsl(var(--md-sys-color-secondary))',
					'on-secondary': 'hsl(var(--md-sys-color-on-secondary))',
					'secondary-container': 'hsl(var(--md-sys-color-secondary-container))',
					'on-secondary-container': 'hsl(var(--md-sys-color-on-secondary-container))',
					tertiary: 'hsl(var(--md-sys-color-tertiary))',
					'on-tertiary': 'hsl(var(--md-sys-color-on-tertiary))',
					'tertiary-container': 'hsl(var(--md-sys-color-tertiary-container))',
					'on-tertiary-container': 'hsl(var(--md-sys-color-on-tertiary-container))',
					surface: 'hsl(var(--md-sys-color-surface))',
					'on-surface': 'hsl(var(--md-sys-color-on-surface))',
					'surface-variant': 'hsl(var(--md-sys-color-surface-variant))',
					'on-surface-variant': 'hsl(var(--md-sys-color-on-surface-variant))',
					outline: 'hsl(var(--md-sys-color-outline))',
					'outline-variant': 'hsl(var(--md-sys-color-outline-variant))',
					background: 'hsl(var(--md-sys-color-background))',
					'on-background': 'hsl(var(--md-sys-color-on-background))',
					error: 'hsl(var(--md-sys-color-error))',
					'on-error': 'hsl(var(--md-sys-color-on-error))',
					'error-container': 'hsl(var(--md-sys-color-error-container))',
					'on-error-container': 'hsl(var(--md-sys-color-on-error-container))',
				},
				// Legacy colors for compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'md-elevation-1': 'var(--md-sys-elevation-level1)',
				'md-elevation-2': 'var(--md-sys-elevation-level2)',
				'md-elevation-3': 'var(--md-sys-elevation-level3)',
				'md-elevation-4': 'var(--md-sys-elevation-level4)',
				'md-elevation-5': 'var(--md-sys-elevation-level5)',
			},
			animation: {
				'md-emphasized-accelerate': 'md-emphasized-accelerate 0.3s ease-out',
				'md-emphasized-decelerate': 'md-emphasized-decelerate 0.3s ease-out',
				'md-standard': 'md-standard 0.2s ease-in-out',
				'md-gradient-flow': 'md-gradient-flow 8s ease-in-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-slow': 'spin 3s linear infinite'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
