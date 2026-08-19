import type { Config } from "tailwindcss";

/**
 * Citadel design tokens.
 *
 * Every value below resolves to a CSS custom property declared in
 * `src/app/globals.css`. Components consume the semantic name
 * (`bg-surface`, `text-ink-muted`, `border-line`) and never a raw colour,
 * so the palette can be retuned in one place.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        /* --- Brand ----------------------------------------------------- */
        brand: {
          DEFAULT: "hsl(var(--brand))",
          strong: "hsl(var(--brand-strong))",
          deep: "hsl(var(--brand-deep))",
          soft: "hsl(var(--brand-soft))",
          line: "hsl(var(--brand-line))",
          foreground: "hsl(var(--brand-foreground))",
        },

        /* --- Surfaces -------------------------------------------------- */
        canvas: "hsl(var(--canvas))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          muted: "hsl(var(--surface-muted))",
          sunken: "hsl(var(--surface-sunken))",
        },

        /* --- Ink ------------------------------------------------------- */
        ink: {
          DEFAULT: "hsl(var(--ink))",
          secondary: "hsl(var(--ink-secondary))",
          muted: "hsl(var(--ink-muted))",
          subtle: "hsl(var(--ink-subtle))",
          inverse: "hsl(var(--ink-inverse))",
        },

        /* --- Lines ----------------------------------------------------- */
        line: {
          DEFAULT: "hsl(var(--line))",
          strong: "hsl(var(--line-strong))",
        },

        /* --- Status ---------------------------------------------------- */
        success: {
          DEFAULT: "hsl(var(--success))",
          fg: "hsl(var(--success-fg))",
          soft: "hsl(var(--success-soft))",
          line: "hsl(var(--success-line))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          fg: "hsl(var(--warning-fg))",
          soft: "hsl(var(--warning-soft))",
          line: "hsl(var(--warning-line))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          fg: "hsl(var(--danger-fg))",
          soft: "hsl(var(--danger-soft))",
          line: "hsl(var(--danger-line))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          fg: "hsl(var(--info-fg))",
          soft: "hsl(var(--info-soft))",
          line: "hsl(var(--info-line))",
        },

        /**
         * Marketing surface. The public landing page is set on near-black so
         * the burgundy reads as a seal rather than a button; the application
         * itself stays on paper. Four steps only — no ad-hoc greys.
         */
        night: {
          DEFAULT: "#08080A",
          raised: "#0E0E11",
          panel: "#141418",
          line: "#22222A",
          muted: "#9A9AA6",
        },

        /* --- shadcn compatibility ------------------------------------- */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },

      /**
       * A deliberate type scale. Body copy is 14px — readable at desk
       * distance — and headings step in musical intervals rather than
       * arbitrary pixel values.
       */
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        xs: ["0.75rem", { lineHeight: "1.125rem" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.375rem" }],
        md: ["0.9375rem", { lineHeight: "1.5rem" }],
        lg: ["1.0625rem", { lineHeight: "1.625rem", letterSpacing: "-0.006em" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.012em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.018em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.022em" }],
        "4xl": ["2.375rem", { lineHeight: "2.75rem", letterSpacing: "-0.026em" }],
        "5xl": ["3rem", { lineHeight: "3.25rem", letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem", { lineHeight: "3.9rem", letterSpacing: "-0.032em" }],
        "7xl": ["4.5rem", { lineHeight: "4.6rem", letterSpacing: "-0.034em" }],
      },

      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 10px)",
      },

      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        seal: "0 0 0 1px hsl(var(--brand) / 0.18), 0 8px 24px -8px hsl(var(--brand) / 0.35)",
      },

      transitionTimingFunction: {
        emphasis: "cubic-bezier(0.32, 0.72, 0, 1)",
      },

      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(16px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.2s ease-out both",
        "fade-up": "fade-up 0.32s cubic-bezier(0.32, 0.72, 0, 1) both",
        "scale-in": "scale-in 0.16s cubic-bezier(0.32, 0.72, 0, 1) both",
        "slide-down": "slide-down 0.16s cubic-bezier(0.32, 0.72, 0, 1) both",
        "slide-in-right": "slide-in-right 0.22s cubic-bezier(0.32, 0.72, 0, 1) both",
        "slide-out-right": "slide-out-right 0.16s ease-in both",
      },
    },
  },
  plugins: [],
};

export default config;
